import {
  Avatar,
  Button,
  ColourRing,
  CrossIcon,
  FormatDateTime,
  SkeletonBox,
  TableData,
  TableRow,
  TickIcon,
  UserIcon,
} from '@/components'
import { SkeletonCircle } from '@/components/Skeletons/Circle'
import { formatToHours } from '@/helpers/date'
import TimeEntry from '@/types/models/TimeEntry'
import { TableRowBaseProps } from '@/types/TableRow'
import classNames from 'classnames'
import { DateTime } from 'luxon'

type RowProps = TableRowBaseProps<TimeEntry>

export const TimeEntriesRow = ({ value, onManage }: RowProps): JSX.Element => {
  const handleManage = () => {
    if (onManage) {
      onManage(value.id)
    }
  }

  const lastName = value.user?.lastname ? ` ${value.user.lastname}` : ''

  return (
    <TableRow>
      <TableData>
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 uppercase">
            {value.user.initials || <UserIcon className="w-5 h-5" />}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-80">
              {value.user.firstname} {value.user.lastname}
            </span>
            {value.user?.role?.name && (
              <span className="text-xs text-gray-50 font-medium">{value.user.role.name}</span>
            )}
          </div>
        </div>
      </TableData>

      <TableData>
        <div className="flex gap-2">
          <ColourRing size="sm" colour={value.budget?.colour} />
          <div className="flex flex-col">
            <span className="font-medium">{value.budget?.name}</span>
            <span className="font-medium text-gray-60">{value.task?.name}</span>
          </div>
        </div>
      </TableData>

      <TableData>
        <span className="whitespace-pre-wrap">{value?.description || '- - -'}</span>
      </TableData>

      <TableData>
        <FormatDateTime value={value.date} format={DateTime.DATE_MED} />
      </TableData>

      <TableData>
        <span>{formatToHours(value?.estimatedMinutes)}</span>
      </TableData>

      <TableData>
        <span>{formatToHours(value?.durationMinutes)}</span>
      </TableData>

      <TableData>
        <div
          className={classNames('w-7 h-7 grid place-content-center rounded-full shrink-0 mx-auto', {
            'bg-green-10': !value?.isBillable,
            'bg-red-10': !value?.isBillable,
          })}
        >
          {value?.isBillable && <TickIcon className="text-green-90 w-4 h-4" />}
          {!value?.isBillable && <CrossIcon className="text-red-90 w-4 h-4" />}
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

export const TimeEntriesSkeletonRow = (): JSX.Element => {
  return (
    <TableRow>
      <TableData className="flex items-center gap-3">
        <SkeletonCircle width={32} height={32} />
        <SkeletonBox height={16} randomWidth />
      </TableData>

      <TableData>
        <div className="flex gap-2">
          <SkeletonCircle width={18} height={18} />
          <div className="flex flex-col gap-1 w-full">
            <SkeletonBox height={14} width="100%" />
            <SkeletonBox height={14} width="50%" />
          </div>
        </div>
      </TableData>

      <TableData>
        <SkeletonBox height={16} randomWidth />
      </TableData>

      <TableData>
        <SkeletonBox height={16} width={50} />
      </TableData>

      <TableData>
        <SkeletonBox height={16} width={50} />
      </TableData>

      <TableData>
        <SkeletonBox height={16} width={50} />
      </TableData>

      <TableData>
        <SkeletonCircle width={32} height={32} />
      </TableData>

      <TableData>
        <SkeletonBox height={16} width={50} />
      </TableData>
    </TableRow>
  )
}
