import { PauseIcon, PlayIcon, ToolTip } from '@/components'
import TimeEntry from '@/types/models/TimeEntry'
import { Button } from '@/components'
import classNames from 'classnames'
import { formatMinutesToTime } from '@/helpers/date'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import ProjectStatus from '@/enums/ProjectStatus'

type TimeEntryCardProps = {
  entry: TimeEntry
  onToggle: (timerId?: number) => void
  onManage: (timerId: number) => void
}

export const TimeEntryCard = ({ entry, onToggle, onManage }: TimeEntryCardProps) => {
  const { timerId, duration } = useSelector((state: RootState) => ({
    timerId: state.timer.timeEntry?.id,
    duration: state.timer.timeEntry?.durationMinutes ?? 0,
  }))

  const isActive = entry?.id === timerId
  const budgetColour = entry.budget.colour

  if (isActive && entry.durationMinutes < duration) {
    entry.durationMinutes = duration
  }

  return (
    <div
      className={classNames('rounded border px-5 lg:px-6 py-4 lg:py-5 flex justify-between', {
        'border-gray-40': !isActive,
        'bg-purple-10 border-purple-90 shadow-sm shadow-purple-70': isActive,
      })}
    >
      {/* Project, Budget and Task */}
      <div className="pr-2 min-w-0">
        <p
          className={classNames(
            'font-semibold text-sm lg:text-base mb-[6px] lg:mb-2 truncate max-w-[450px]',
            {
              'text-gray-50': !isActive,
              'text-gray-60': isActive,
            },
          )}
        >
          {entry.task.name}
        </p>
        <div className="flex gap-4">
          <h2 className="font-medium text-base lg:text-xl text-gray-100 truncate">
            {entry.budget.name}
          </h2>
        </div>
        <div className="pt-[7px] pb-3 lg:pt-[10px] lg:pb-4">
          <div
            className="rounded max-w-[120px] h-1"
            style={{ backgroundColor: budgetColour ?? '#3EC729' }}
          ></div>
        </div>
        <p className="text-sm lg:text-base text-gray-80">{entry.description ?? 'No Description'}</p>
      </div>

      {/* Timer Details */}
      <div className="flex flex-col justify-between pl-2">
        <div className="flex gap-4 items-start">
          <ToolTip
            delay={150}
            width={250}
            disabled={entry?.budget?.project?.status === ProjectStatus.ACTIVE}
            className="text-gray-80 text-sm"
            tipFill="fill-gray-80"
            trigger={
              <button
                type="button"
                onClick={() => onToggle(entry?.id)}
                disabled={entry?.budget?.project?.status !== ProjectStatus.ACTIVE}
                className="w-[38px] h-[38px] lg:w-[42px] lg:h-[42px] border-purple-90 text-purple-90 rounded-full border-2 p-2 outline-none"
              >
                <span>{isActive ? <PauseIcon /> : <PlayIcon />}</span>
              </button>
            }
          >
            <span>Cannot restart timers against inactive projects</span>
          </ToolTip>

          <div className="text-left lg:space-y-[2px] w-[72px] lg:w-[77px]">
            <p
              className={classNames('text-xs lg:text-[13px] lg:leading-[18px] font-semibold', {
                'text-gray-50': !isActive,
                'text-gray-60': isActive,
              })}
            >
              {entry.task.isBillable ? 'Billable' : 'Non-Billable'}
            </p>
            <p className="text-xl lg:text-2xl text-gray-100 font-medium">
              {formatMinutesToTime(entry.durationMinutes)}
            </p>
          </div>
        </div>

        <div className="self-end">
          <Button
            variant="blank"
            onClick={() => onManage(entry?.id)}
            className="min-h-0 text-base"
            disabled={entry?.budget?.project?.status !== ProjectStatus.ACTIVE || isActive}
          >
            Manage
          </Button>
        </div>
      </div>
    </div>
  )
}
