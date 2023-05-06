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
import { NewTimeEntryModal } from '../../components/Modals/NewTimeEntry'
import {
  ManageTimeEntryModal,
  TimeEntryCard,
  TimesheetPeriod,
  WeekDaySelect,
} from '../../components'
import { cloneDeep, groupBy, sumBy } from 'lodash'
import { TimesheetDayInsights } from '../../components/Insights'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const TimerPage = (): JSX.Element => {
  useDocumentTitle('Timer')

  const [openNewTimeEntryModal, setOpenNewTimeEntryModal] = useState(false)
  const [timeEntryId, setTimeEntryId] = useState<number | null>(null)

  const { startDate, endDate, timer, isTracking, selectedDate, authId } = useSelector(
    (state: RootState) => ({
      startDate: state.timer.timesheet.startDate,
      endDate: state.timer.timesheet.endDate,
      selectedDate: state.timer.timesheet.selectedDay,
      timer: state.timer.timeEntry,
      isTracking: state.timer.isTracking,
      authId: state.auth.user?.id,
    }),
  )

  const { restartTimer, stopTimer } = useTimeTracker()

  const { data: timesheet } = useGetTimesheetQuery(
    {
      startDate: startDate ?? DateTime.now().startOf('week').toISODate()!,
      endDate: endDate ?? DateTime.now().endOf('week').toISODate()!,
      userId: authId as number,
    },
    { skip: !authId },
  )

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

  const formattedWeek = useMemo(() => {
    if (startDate && endDate) {
      const dates = getDatesBetweenPeriod(DateTime.fromISO(startDate), DateTime.fromISO(endDate))
      const groupedEntries = groupBy(cloneDeep(timesheet), (e) => e.date)

      return dates.map((day) => ({
        weekDay: day!.toISODate(),
        dailyDuration: sumBy(
          groupedEntries[day!.toISODate() as keyof typeof groupedEntries],
          (e) => e.durationMinutes,
        ),
        timeEntries: groupedEntries[day!.toISODate() as keyof typeof groupedEntries],
      }))
    }
  }, [timesheet, startDate, endDate])

  const selectedDay = formattedWeek?.find((weekDay) => weekDay.weekDay === selectedDate)

  const insights = useMemo(() => {
    const dayEntries = cloneDeep(selectedDay?.timeEntries ?? [])
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
      dailyDuration: sumBy(dayEntries, (e) => e.durationMinutes) ?? 0,
      weeklyDuration: sumBy(timesheet, (e) => e.durationMinutes) ?? 0,
    }
  }, [timesheet, selectedDate, timer])

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
          <div className="flex justify-between items-end max-w-[1000px] pt-6 px-6">
            <WeekDaySelect />
          </div>

          {/* Times */}
          <div className="bg-gray-20 py-[6px] lg:py-2">
            <div className="flex justify-between items-center max-w-[1000px] px-6">
              {formattedWeek?.map((weekDay) => (
                <div key={weekDay.weekDay} className="px-1">
                  <span className="font-medium text-xs md:text-sm lg:text-base text-gray-70">
                    {formatMinutesToHourMinutes(weekDay.dailyDuration ?? 0)}
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
                    value={DateTime.fromISO(selectedDate ?? '')}
                    format="LLLL dd, yyyy"
                  />
                </div>
              }
            />
          </div>

          <div className="grid grid-cols-12 p-6">
            <div className="space-y-2 col-span-12 lg:col-span-7">
              {selectedDay?.timeEntries?.map((entry) => (
                <TimeEntryCard
                  key={entry.id}
                  entry={entry}
                  onToggle={handleTracking}
                  onManage={(id) => setTimeEntryId(id)}
                />
              ))}
            </div>

            <div className="hidden lg:block lg:col-span-5">
              <TimesheetDayInsights value={insights} />
            </div>
          </div>
        </Card>
      </PageContent>

      <NewTimeEntryModal
        activeProject={true}
        isOpen={openNewTimeEntryModal}
        onClose={() => setOpenNewTimeEntryModal((state) => !state)}
      />
      <ManageTimeEntryModal
        entryId={timeEntryId}
        isOpen={!!timeEntryId}
        onClose={() => setTimeEntryId(null)}
        activeProject={true}
      />
    </Page>
  )
}
