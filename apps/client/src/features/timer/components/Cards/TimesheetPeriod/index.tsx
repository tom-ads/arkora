import { ArrowThin, Button, Card, HorizontalDivider } from '@/components'
import { addOrdinalSuffix } from '@/helpers/date'
import { setTimesheetPeriod } from '@/stores/slices/timer'
import { RootState } from '@/stores/store'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const TimesheetPeriod = (): JSX.Element => {
  const dispatch = useDispatch()

  const { timesheet } = useSelector((state: RootState) => ({
    timesheet: state.timer.timesheet,
  }))

  const handleWeekChange = (forwards: boolean) => {
    const currentStartDate = DateTime.fromISO(timesheet.startDate!)
    const currentEndDate = DateTime.fromISO(timesheet.endDate!)

    dispatch(
      setTimesheetPeriod({
        startDate: forwards
          ? currentStartDate.plus({ week: 1 }).startOf('week').toISO()
          : currentStartDate.minus({ week: 1 }).startOf('week').toISO(),
        endDate: forwards
          ? currentEndDate.plus({ week: 1 }).endOf('week').toISO()
          : currentEndDate.minus({ week: 1 }).endOf('week').toISO(),
      }),
    )
  }

  const handleBack = () => {
    dispatch(
      setTimesheetPeriod({
        startDate: DateTime.now().startOf('week').toISO(),
        endDate: DateTime.now().endOf('week').toISO(),
      }),
    )
  }

  const period = useMemo(() => {
    const currentStartDate = DateTime.fromISO(timesheet.startDate!)
    const currentEndDate = DateTime.fromISO(timesheet.endDate!)

    return {
      currentWeek: currentStartDate.equals(DateTime.now().startOf('week')),
      startDate: currentStartDate.hasSame(currentEndDate, 'month')
        ? addOrdinalSuffix(currentStartDate, 'dd ')
        : addOrdinalSuffix(currentStartDate, 'dd  LLL, yyyy'),
      endDate: currentStartDate.hasSame(currentEndDate, 'month')
        ? addOrdinalSuffix(currentEndDate, 'dd , LLL yyyy')
        : addOrdinalSuffix(currentEndDate, 'dd  LLL, yyyy'),
    }
  }, [timesheet.startDate, timesheet.endDate])

  return (
    <Card className="space-y-2">
      {/* Timesheet Heading */}
      <div className="flex gap-x-4 items-center">
        <span className="font-semibold text-base md:text-xl text-gray-50">Timesheet</span>
        <HorizontalDivider />
      </div>

      {/* Timesheet Week */}
      <div className="flex justify-between items-center flex-wrap gap-2 md:gap-4 sm:flex-nowrap">
        {timesheet?.startDate && timesheet?.endDate && (
          <div>
            <p className="text-gray-90 text-xl md:text-2xl capitalize font-medium transition-all">
              {`${period.startDate} - ${period.endDate}`}
            </p>
            <Button
              variant="blank"
              disabled={period.currentWeek}
              onClick={handleBack}
              className="text-sm md:text-base"
            >
              Back to Current Week
            </Button>
          </div>
        )}

        {/* Timesheet Controls */}
        <div className="flex gap-x-4 mb-auto">
          <Button
            size="xs"
            variant="outlined"
            onClick={() => handleWeekChange(false)}
            className="font-normal gap-x-4 !px-3 !py-0 shrink-0 min-h-[32px] lg:min-h-[39px]"
          >
            <ArrowThin className="w-6 h-6" />
            <span className="hidden lg:block">Prev Week</span>
          </Button>
          <Button
            size="xs"
            variant="outlined"
            onClick={() => handleWeekChange(true)}
            className="font-normal gap-x-4 !px-3 !py-0 shrink-0 min-h-[32px] lg:min-h-[39px]"
          >
            <span className="hidden lg:block">Next Week</span>
            <ArrowThin className="w-6 h-6 transform rotate-180" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
