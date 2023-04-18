import { formatMinutesToHourMinutes } from '@/helpers/date'
import { calcDailyDuration } from '@/helpers/organisation'
import { RootState } from '@/stores/store'
import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import { BillablePieChart } from '../../Metrics/BillablePieChart'
import { TotalTimePieChart } from '../../Metrics/TotalTimePieChart'

type TimesheetInsights = {
  billableDuration: number
  unbillableDuration: number
  dailyDuration: number
  weeklyDuration: number
}

type TimesheetDayInsightsProps = {
  value: TimesheetInsights
}

export const TimesheetDayInsights = ({ value }: TimesheetDayInsightsProps): JSX.Element => {
  const organisation = useSelector((state: RootState) => state.organisation)

  const openingTime = DateTime.fromISO(organisation.openingTime!)
  const closingTime = DateTime.fromISO(organisation.closingTime!)

  const dailyGoalDuration = calcDailyDuration(
    openingTime,
    closingTime,
    organisation.breakDuration ?? 0,
  )
  const weeklyGoalDuration = dailyGoalDuration * (organisation?.businessDays?.length ?? 0)

  return (
    <>
      <div className="grid grid-cols-2">
        <TotalTimePieChart totalTime={value.dailyDuration} threshold={dailyGoalDuration} />
        <BillablePieChart
          billableDuration={value.billableDuration}
          unbillableDuration={value.unbillableDuration}
        />
      </div>

      <div className="px-10 divide-y divide-gray-40 divide-dashed">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-80">Daily Goal</span>
          <span className="text-gray-100 font-medium">
            {formatMinutesToHourMinutes(dailyGoalDuration ?? 0)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-gray-80">Daily Remaining</span>
          <span className="text-gray-100 font-medium">
            {formatMinutesToHourMinutes((dailyGoalDuration ?? 0) - (value.dailyDuration ?? 0))}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-gray-80">Weekly Goal</span>
          <span className="text-gray-100 font-medium">
            {formatMinutesToHourMinutes(weeklyGoalDuration ?? 0)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-gray-80">Weekly Remaining</span>
          <span className="text-gray-100 font-medium">
            {formatMinutesToHourMinutes((weeklyGoalDuration ?? 0) - (value.weeklyDuration ?? 0))}
          </span>
        </div>
      </div>
    </>
  )
}
