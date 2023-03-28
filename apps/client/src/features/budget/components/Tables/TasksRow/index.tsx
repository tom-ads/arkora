import {
  Button,
  CrossIcon,
  DoubleProgressLineIndicator,
  SkeletonBox,
  TableData,
  TableRow,
  TickIcon,
  ToolTip,
} from '@/components'
import { SkeletonCircle } from '@/components/Skeletons/Circle'
import { calculatePercentage } from '@/helpers/currency'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import Task from '@/types/models/Task'
import { TableRowBaseProps } from '@/types/TableRow'
import classNames from 'classnames'

type TasksRowProps = TableRowBaseProps<Task>

export const BudgetTaskRow = ({ value, onManage }: TasksRowProps): JSX.Element => {
  const handleManage = () => {
    if (onManage) {
      onManage(value.id)
    }
  }

  return (
    <TableRow>
      <TableData>
        <span>{value.name}</span>
      </TableData>

      <TableData>
        {formatMinutesToHourMinutes(value.billableDuration + value.unbillableDuration)}
      </TableData>

      <TableData>
        <ToolTip
          width={262}
          trigger={
            <DoubleProgressLineIndicator
              leftPercent={calculatePercentage(
                value.billableDuration,
                value.billableDuration + value.unbillableDuration,
              )}
              rightPercent={calculatePercentage(
                value.unbillableDuration,
                value.billableDuration + value.unbillableDuration,
              )}
            />
          }
        >
          <div className="divide-y divide-gray-40 divide-dashed">
            <div className="flex justify-between items-center py-1">
              <p className="font-medium text-xs text-green-90">Billable</p>
              <p className="font-semibold text-xs text-gray-80">
                {formatMinutesToHourMinutes(value.billableDuration)}
              </p>
            </div>
            <div className="flex justify-between items-center py-1">
              <p className="font-medium text-xs text-red-90">Non-Billable</p>
              <p className="font-semibold text-xs text-gray-80">
                {formatMinutesToHourMinutes(value.unbillableDuration)}
              </p>
            </div>
          </div>
        </ToolTip>
      </TableData>

      <TableData>
        <div
          className={classNames('rounded-full w-8  h-8 grid place-content-center', {
            'bg-green-10 text-green-90': value.isBillable,
            'bg-red-10 text-red-90': !value.isBillable,
          })}
        >
          {value.isBillable && <TickIcon className="text-green-90 w-4 h-4" />}
          {!value.isBillable && <CrossIcon className="text-red-90 w-4 h-4" />}
        </div>
      </TableData>

      <TableData>
        <Button variant="blank" onClick={handleManage}>
          Manage
        </Button>
      </TableData>
    </TableRow>
  )
}

export const BudgetTaskSkeletonRow = (): JSX.Element => {
  return (
    <TableRow>
      <TableData>
        <SkeletonBox height={20} randomWidth />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={100} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={170} />
      </TableData>

      <TableData>
        <SkeletonCircle height={30} width={30} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={70} />
      </TableData>
    </TableRow>
  )
}
