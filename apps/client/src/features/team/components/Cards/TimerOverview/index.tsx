import { Avatar, Card, VerticalDivider } from '@/components'
import { Timer } from '@/types/models/Timer'

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
  return (
    <Card className="px-8 py-5 flex justify-between">
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

      <div></div>
    </Card>
  )
}
