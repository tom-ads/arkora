import {
  Button,
  Card,
  ClockIcon,
  FormatDateTime,
  HorizontalDivider,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components'
import { useGetTimesheetQuery } from '@/features/timesheet'
import {
  formatMinutesToHourMinutes,
  formatMinutesToTime,
  getDatesBetweenPeriod,
} from '@/helpers/date'
import { useTimeTracker } from '@/hooks/useTimeTracker'
import { RootState } from '@/stores/store'
import { Transition } from '@headlessui/react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  ManageTimeEntryModal,
  TimeEntryCard,
  TimesheetPeriod,
  WeekDaySelect,
} from '../../components'
import { NewTimeEntryModal } from '../../components/Modals/NewTimeEntry'
import { BillablePieChart } from '../../components/Metrics/BillablePieChart'
import { cloneDeep, groupBy, sumBy } from 'lodash'

export const TimerPage = (): JSX.Element => {
  const [openNewTimeEntryModal, setOpenNewTimeEntryModal] = useState(false)
  const [timeEntryId, setTimeEntryId] = useState<number | null>(null)

  const { timesheet, timer, isTracking } = useSelector((state: RootState) => ({
    timesheet: state.timer.timesheet,
    timer: state.timer.timeEntry,
    isTracking: state.timer.isTracking,
  }))

  const { restartTimer, stopTimer } = useTimeTracker()

  const { data: weekDays } = useGetTimesheetQuery({
    start_date: timesheet.startDate ?? DateTime.now().startOf('week').toISODate(),
    end_date: timesheet.endDate ?? DateTime.now().endOf('week').toISODate(),
  })

  const handleTracking = async (timerId?: number) => {
    if (isTracking && timer?.id) {
      await stopTimer(timer.id)
      return
    }

    if (timerId) {
      await restartTimer(timerId)
      return
    }

    setOpenNewTimeEntryModal(true)
  }

  const week = useMemo(() => {
    if (timesheet.startDate && timesheet.endDate) {
      const dates = getDatesBetweenPeriod(
        DateTime.fromISO(timesheet.startDate),
        DateTime.fromISO(timesheet.endDate),
      )

      return dates.map((day) => {
        const payloadDate = weekDays?.days.find((weekDay) => weekDay.day === day.toISODate())
        return {
          ...payloadDate,
          day: payloadDate?.day ?? day.toISODate(),
          totalMinutes: payloadDate?.totalMinutes ?? 0,
        }
      })
    }
  }, [weekDays, timesheet])

  const selectedDay = week?.find((weekDay) => weekDay.day === timesheet.selectedDay)

  const billableSeries = useMemo(() => {
    const dayEntries = cloneDeep(selectedDay?.entries ?? [])
    if (timer) {
      dayEntries?.map((entry) => {
        if (entry.id === timer.id) {
          entry.durationMinutes = timer.durationMinutes ?? 0
        }

        return entry
      }) ?? []
    }

    const groupedEntries = groupBy(dayEntries, (e) =>
      e.task.isBillable ? 'billable' : 'nonBillable',
    )

    return {
      billableDuration: sumBy(groupedEntries['billable'], (e) => e.durationMinutes) ?? 0,
      unbillableDuration: sumBy(groupedEntries['nonBillable'], (e) => e.durationMinutes) ?? 0,
    }
  }, [selectedDay, timer])

  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Timer</PageTitle>
          <PageDescription>Start tracking against a budget to record your time</PageDescription>
        </span>
        <div className="flex gap-2 items-center text-white">
          <Transition
            show={isTracking}
            enter="transition duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="min-w-[96px] shrink-0 text-left"
          >
            <p className="font-medium text-3xl animate-pulse">
              {formatMinutesToTime(timer?.durationMinutes ?? 0)}
            </p>
          </Transition>
          <Button
            size="xs"
            variant="secondary"
            onClick={() => handleTracking()}
            className="w-[200px] py-2"
            block
          >
            <div className="flex items-center gap-2">
              <ClockIcon className="w-6 h-6 shrink-0" />
              <span>{`${isTracking ? 'Stop' : 'Start'} Timer`}</span>
            </div>
          </Button>
        </div>
      </PageHeader>

      <PageContent className="space-y-6">
        <TimesheetPeriod />

        <Card className="p-0 min-h-[800px]">
          <div className="max-w-[1115px]">
            <WeekDaySelect />
          </div>

          {/* Times */}
          <div className="bg-gray-20 py-[6px] lg:py-2">
            <div className="max-w-[1115px] px-6 flex justify-between items-center">
              {week?.map((weekDay) => (
                <div
                  key={`time-period-${weekDay.day}`}
                  className="w-[56px] sm:w-[64px] md:w-[80px] lg:w-[90px] px-1"
                >
                  <span className="font-medium text-xs md:text-sm lg:text-base text-gray-70">
                    {formatMinutesToHourMinutes(weekDay.totalMinutes ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pt-6">
            <HorizontalDivider
              contentLeft={
                <span className="whitespace-nowrap font-semibold text-gray-100 text-lg">
                  Time Entries
                </span>
              }
              contentRight={
                <div className="whitespace-nowrap font-semibold text-gray-100 text-lg">
                  <FormatDateTime
                    value={DateTime.fromISO(selectedDay?.day ?? '')}
                    format="LLLL dd, yyyy"
                  />
                </div>
              }
            />
          </div>

          <div className="p-6 space-y-2 md:max-w-[800px]">
            {selectedDay?.entries?.map((entry) => (
              <TimeEntryCard
                key={entry.id}
                entry={entry}
                onToggle={handleTracking}
                onManage={(id) => setTimeEntryId(id)}
              />
            ))}
          </div>

          <div>
            <BillablePieChart
              data={[billableSeries['billableDuration'], billableSeries['unbillableDuration']]}
            />
          </div>
        </Card>
      </PageContent>

      <NewTimeEntryModal
        isOpen={openNewTimeEntryModal}
        onClose={() => setOpenNewTimeEntryModal((state) => !state)}
      />
      <ManageTimeEntryModal
        entryId={timeEntryId}
        isOpen={!!timeEntryId}
        onClose={() => setTimeEntryId(null)}
      />
    </Page>
  )
}
