import { Badge, PauseIcon, PlayIcon } from '@/components'
import { durationToFormattedTime } from '@/helpers/date'
import TimeEntry from '@/types/TimeEntry'
import { Button } from '@/components'
import classNames from 'classnames'
import { useMemo } from 'react'

type TimeEntryCardProps = {
  entry: TimeEntry
  minutes: number
  onToggle: (timerId?: number) => void
}

export const TimeEntryCard = ({ entry, onToggle }: TimeEntryCardProps) => {
  const isActiveEntry = !entry.lastStoppedAt

  const duration = useMemo(() => {
    return durationToFormattedTime(entry.durationMinutes).consumableFormat
  }, [isActiveEntry])

  return (
    <div
      className={classNames('rounded border px-5 lg:px-6 py-4 lg:py-5 flex justify-between', {
        'border-gray-40': !isActiveEntry,
        'bg-purple-10 border-purple-90 shadow-sm shadow-purple-70': isActiveEntry,
      })}
    >
      {/* Project, Budget and Task */}
      <div className="pr-2">
        <p
          className={classNames('font-semibold text-sm lg:text-base mb-[6px] lg:mb-2', {
            'text-gray-50': !isActiveEntry,
            'text-gray-60': isActiveEntry,
          })}
        >
          {entry.budget.projectName}
        </p>
        <div className="flex gap-4">
          <h2 className="font-medium text-base lg:text-xl text-gray-100">{entry.budget.name}</h2>
          <Badge
            variant="primary"
            className={classNames('hidden sm:flex', { '!bg-purple-20': isActiveEntry })}
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
          <button
            type="button"
            onClick={() => onToggle(entry?.id)}
            className="w-[38px] h-[38px] lg:w-[42px] lg:h-[42px] border-purple-90 text-purple-90 rounded-full border-2 p-2 outline-none"
          >
            {isActiveEntry ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="text-left lg:space-y-[2px] w-[72px] lg:w-[77px]">
            <p
              className={classNames('text-xs lg:text-[13px] lg:leading-[18px] font-semibold', {
                'text-gray-50': !isActiveEntry,
                'text-gray-60': isActiveEntry,
              })}
            >
              {entry.budget.billable ? 'Billable' : 'Non-Billable'}
            </p>
            <p className="text-xl lg:text-2xl text-gray-100 font-medium">{duration}</p>
          </div>
        </div>

        <div className="self-end">
          <Button variant="blank" className="min-h-0 text-base">
            Manage
          </Button>
        </div>
      </div>
    </div>
  )
}
