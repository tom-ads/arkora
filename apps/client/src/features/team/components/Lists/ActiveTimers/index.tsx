import { Timer } from '@/types/models/Timer'
import { TimerOverviewCard } from '../../Cards'

type ActiveTimersListProps = {
  value: Timer[]
}

export const ActiveTimersList = ({ value }: ActiveTimersListProps) => {
  return (
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
  )
}
