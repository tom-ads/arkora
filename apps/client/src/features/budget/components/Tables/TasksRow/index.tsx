import { Button, CrossIcon, SkeletonBox, TableData, TableRow, TickIcon } from '@/components'
import { SkeletonCircle } from '@/components/Skeletons/Circle'
import UserRole from '@/enums/UserRole'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import { RootState } from '@/stores/store'
import Task from '@/types/models/Task'
import { TableRowBaseProps } from '@/types/TableRow'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

type TasksRowProps = TableRowBaseProps<Task>

export const BudgetTaskRow = ({ value, onManage }: TasksRowProps): JSX.Element => {
  const authRole = useSelector((state: RootState) => state.auth.user?.role?.name)

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
        {authRole !== UserRole.MEMBER && (
          <Button variant="blank" onClick={handleManage}>
            Manage
          </Button>
        )}
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
        <SkeletonCircle height={30} width={30} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={70} />
      </TableData>
    </TableRow>
  )
}
