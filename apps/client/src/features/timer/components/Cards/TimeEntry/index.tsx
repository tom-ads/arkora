import { Badge, PauseIcon, PlayIcon, ToolTip } from '@/components'
import TimeEntry from '@/types/models/TimeEntry'
import { Button } from '@/components'
import classNames from 'classnames'
import { formatMinutesToTime } from '@/helpers/date'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import ProjectStatus from '@/enums/ProjectStatus'

type TimeEntryCardProps = {
  entry: TimeEntry
  onToggle: (timerId?: number) => void
  onManage: (timerId: number) => void
}

export const TimeEntryCard = ({ entry, onToggle, onManage }: TimeEntryCardProps) => {
  const duration = useSelector((state: RootState) => state.timer.timeEntry?.durationMinutes ?? 0)

  const [entryDuration, setEntryDuration] = useState(entry.durationMinutes)

  const isActive = !entry.lastStoppedAt

  useEffect(() => {
    if (isActive && entryDuration < duration) {
      setEntryDuration(duration)
    } else if (!isActive && entryDuration !== entry.durationMinutes) {
      setEntryDuration(entry.durationMinutes)
    }
  }, [entryDuration, duration, isActive, entry.durationMinutes])

  return (
    <div
      className={classNames('rounded border px-5 lg:px-6 py-4 lg:py-5 flex justify-between', {
        'border-gray-40': !isActive,
        'bg-purple-10 border-purple-90 shadow-sm shadow-purple-70': isActive,
      })}
    >
      {/* Project, Budget and Task */}
      <div className="pr-2">
        <p
          className={classNames('font-semibold text-sm lg:text-base mb-[6px] lg:mb-2', {
            'text-gray-50': !isActive,
            'text-gray-60': isActive,
          })}
        >
          {entry.budget?.project?.name}
        </p>
        <div className="flex gap-4">
          <h2 className="font-medium text-base lg:text-xl text-gray-100">{entry.budget.name}</h2>
          <Badge
            variant="primary"
            className={classNames('hidden sm:flex', { '!bg-purple-20': isActive })}
          >
            {entry.task.name}
          </Badge>
        </div>
        <div className="pt-[7px] pb-3 lg:pt-[10px] lg:pb-4">
          <div className="rounded max-w-[120px] bg-green-60 h-1"></div>
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
            className="bg-gray-80 text-white text-sm"
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
            <span>Cannot restart timers against non-active projects</span>
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
              {formatMinutesToTime(entryDuration)}
            </p>
          </div>
        </div>

        <div className="self-end">
          <Button variant="blank" onClick={() => onManage(entry?.id)} className="min-h-0 text-base">
            Manage
          </Button>
        </div>
      </div>
    </div>
  )
}
