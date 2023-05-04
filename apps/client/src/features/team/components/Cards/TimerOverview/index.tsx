import { Avatar, Card, VerticalDivider } from '@/components'
import { formatMinutesToTime } from '@/helpers/date'
import { Timer } from '@/types/models/Timer'
import classNames from 'classnames'

type ReadOnlyProps = {
  label: string
  value?: string
}

const Readonly = ({ label, value }: ReadOnlyProps) => {
  return (
    <div className="min-w-[50px] md:min-w-[100px] lg:min-w-[150px]">
      <p className="font-semibold text-[13px] text-gray-50">{label}</p>
      <p className="text-base font-semibold text-gray-100">{value ?? '---'}</p>
    </div>
  )
}

type TimerOverviewCardProps = {
  value: Timer
}

export const TimerOverviewCard = ({ value }: TimerOverviewCardProps): JSX.Element => {
  const isActive = value?.timer?.lastStoppedAt === null

  return (
    <Card className="px-8 py-5 flex justify-between min-h-[50px]">
      <div className="flex gap-4 items-center">
        <Avatar className="w-10 h-10 bg-purple-10">{value.initials}</Avatar>
        <VerticalDivider />
        <div className="w-[150px]">
          <p className="text-purple-90 text-base font-medium truncate">
            {value.firstname} {value.lastname}
          </p>
          <p className="text-gray-50 font-semibold text-[13px]">{value.role.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-x-8">
        <Readonly label="Project" value={value.timer?.budget?.project?.name} />
        <VerticalDivider />
        <Readonly label="Budget" value={value.timer?.budget?.name} />
        <VerticalDivider />
        <Readonly label="Task" value={value.timer?.task?.name} />
      </div>

      <div className="flex flex-col justify-between pl-2">
        <div className="flex gap-4 items-start">
          <div className="text-left lg:space-y-[2px] w-[72px] lg:w-[77px]">
            <p
              className={classNames('text-xs lg:text-[13px] lg:leading-[18px] font-semibold', {
                'text-gray-50': !isActive,
                'text-gray-60': isActive,
              })}
            >
              {value?.timer?.isBillable ? 'Billable' : 'Non-Billable'}
            </p>
            <p className="text-xl text-gray-100 font-medium">
              {formatMinutesToTime(value?.timer?.durationMinutes ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
