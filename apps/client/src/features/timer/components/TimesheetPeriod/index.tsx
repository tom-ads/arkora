import { ArrowThin, Button, Card, Divider } from '@/components'
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

  const period = useMemo(() => {
    const currentStartDate = DateTime.fromISO(timesheet.startDate!)
    const currentEndDate = DateTime.fromISO(timesheet.endDate!)

    return {
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
        <span className="font-semibold text-xl text-gray-50">Timesheet</span>
        <Divider />
      </div>

      {/* Timesheet Week */}
      <div className="flex justify-between items-center flex-wrap gap-4 sm:flex-nowrap">
        {timesheet?.startDate && timesheet?.endDate && (
          <p className="text-gray-90 text-2xl capitalize font-medium transition-all">
            {`${period.startDate} - ${period.endDate}`}
          </p>
        )}

        <div className="flex gap-x-4">
          <Button
            size="xs"
            variant="outlined"
            onClick={() => handleWeekChange(false)}
            className="h-[39px] font-normal gap-x-4 !px-3 !py-2 shrink-0"
          >
            <ArrowThin className="w-6 h-6 hidden md:block" />
            <span>Prev Week</span>
          </Button>
          <Button
            size="xs"
            variant="outlined"
            onClick={() => handleWeekChange(true)}
            className="h-[39px] font-normal gap-x-4 !px-3 !py-2 shrink-0"
          >
            <span>Next Week</span>
            <ArrowThin className="w-6 h-6 transform rotate-180 hidden md:block" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
