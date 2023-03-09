import { HorizontalDivider } from '@/components'
import { Timer } from '@/types/models/Timer'
import { TimerOverviewCard } from '../../Cards'

type ActiveTimersListProps = {
  value: Timer[]
}

export const ActiveTimersList = ({ value }: ActiveTimersListProps) => {
  const numOfTimersPadded =
    value?.length < 10 ? `0${value?.length === 0 ? '' : value.length}` : value?.length

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-5">
        <p className="text-gray-60 font-semibold text-xl whitespace-nowrap">
          <span className="text-gray-100">{numOfTimersPadded}</span> Active Timers
        </p>
        <HorizontalDivider />
      </div>
      <ul className="space-y-4">
        {value?.length > 0 ? (
          <>
            {value?.map((timer) => (
              <TimerOverviewCard key={timer.id} value={timer} />
            ))}
          </>
        ) : (
          <div className="py-9 w-full text-center">
            <p className="font-semibold text-xl text-gray-50 whitespace-nowrap">No Active Timers</p>
          </div>
        )}
      </ul>
    </div>
  )
}
