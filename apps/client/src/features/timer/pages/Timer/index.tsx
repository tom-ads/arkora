import {
  Button,
  Card,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
  PauseIcon,
  PlayIcon,
} from '@/components'
import { useGetTimesheetQuery } from '@/features/timesheet'
import { durationToFormattedTime, getDatesBetweenPeriod } from '@/helpers/date'
import { useTimeTracker } from '@/hooks/useTimeTracker'
import { RootState } from '@/stores/store'
import { Transition } from '@headlessui/react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { TimeEntryCard, TimesheetPeriod, WeekDaySelect } from '../../components'
import { NewTimeEntryModal } from '../../components/Modals/NewTimeEntry'

export const TimerPage = (): JSX.Element => {
  const [openNewTimeEntryModal, setOpenNewTimeEntryModal] = useState(false)

  const { timesheet, timer } = useSelector((state: RootState) => ({
    timesheet: state.timer.timesheet,
    timer: state.timer,
  }))

  const [minutes, { restartTracking, stopTracking }] = useTimeTracker(60000)

  const { data: weekDays } = useGetTimesheetQuery({
    start_date: timesheet.startDate ?? DateTime.now().startOf('week').toISODate(),
    end_date: timesheet.endDate ?? DateTime.now().endOf('week').toISODate(),
  })

  const handleTracking = async (timerId?: number) => {
    if (timer.isTracking) {
      await stopTracking(timer.trackedEntry!.id)
      return
    }

    if (timerId) {
      await restartTracking(timerId)
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

      return Array.from({ length: dates.length }, (_, idx) => dates[idx]).map((day) => {
        const payloadDate = weekDays?.days.find((weekDay) => weekDay.day === day.toISODate())
        return {
          ...payloadDate,
          ...durationToFormattedTime(payloadDate?.totalMinutes ?? 0),
          day: payloadDate?.day ?? day.toISODate(),
          totalMinutes: payloadDate?.totalMinutes ?? 0,
        }
      })
    }
  }, [weekDays, timesheet])

  const selectedDay = week?.find((weekDay) => weekDay.day === timesheet.selectedDay)

  const formatTimer = durationToFormattedTime(minutes)

  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Timer</PageTitle>
          <PageDescription>Start tracking against a budget to record your time</PageDescription>
        </span>
        <div className="flex gap-6 items-center text-white">
          <Transition
            show={timer.isTracking}
            enter="transition duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="min-w-[96px] shrink-0 text-left"
          >
            <p className="font-medium text-3xl">{formatTimer.consumableFormat}</p>
          </Transition>
          <Button
            size="xs"
            variant="secondary"
            onClick={() => handleTracking()}
            className="w-[174px]"
            block
          >
            {timer.isTracking ? (
              <PauseIcon className="w-4 h-4 shrink-0" />
            ) : (
              <PlayIcon className="w-4 h-4 shrink-0" />
            )}
            <span>{`${timer.isTracking ? 'Stop' : 'Start'} Timer`}</span>
          </Button>
        </div>
      </PageHeader>

      <PageContent className="space-y-6">
        <TimesheetPeriod />

        <Card className="p-0">
          <WeekDaySelect />

          {/* Times */}
          <div className="bg-gray-20 py-[6px] lg:py-2">
            <div className="max-w-[1100px] px-6 flex justify-between items-center">
              {week?.map((currentDate) => (
                <div
                  key={`time-period-${currentDate.day}`}
                  className="w-[56px] sm:w-[64px] md:w-[80px] lg:w-[90px] px-1"
                >
                  <span className="font-medium text-xs md:text-sm lg:text-base text-gray-70">
                    {currentDate?.displayFormat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-2 md:max-w-[800px]">
            {selectedDay?.entries?.map((entry) => (
              <TimeEntryCard
                key={`time-entry-${entry.id}`}
                entry={entry}
                minutes={minutes}
                onToggle={handleTracking}
              />
            ))}
          </div>
        </Card>
      </PageContent>

      <NewTimeEntryModal
        isOpen={openNewTimeEntryModal}
        onClose={() => setOpenNewTimeEntryModal((state) => !state)}
      />
    </Page>
  )
}