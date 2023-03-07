import {
  Avatar,
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
import TimeEntry from '@/types/TimeEntry'
import { DateTime } from 'luxon'

type TimeEntryRowProps = {
  value: TimeEntry
}

export const TimeEntrySkeletonRow = (): JSX.Element => {
  return (
    <TableRow>
      <TableData>
        <></>
      </TableData>

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
        <SkeletonCircle width={32} height={32} />
      </TableData>
    </TableRow>
  )
}

export const TimeEntryRow = ({ value }: TimeEntryRowProps): JSX.Element => {
  return (
    <TableRow key={value.id}>
      <TableData>
        <></>
      </TableData>

      <TableData>
        <div className="flex items-center gap-3">
          <Avatar>{value.user.initials || <UserIcon />}</Avatar>
          <span className="font-medium">
            {`${value.user?.firstname ?? ''}${
              value.user?.lastname ? ` ${value.user.lastname}` : ''
            }`}
          </span>
        </div>
      </TableData>

      <TableData>
        <div className="flex gap-2">
          <ColourRing size="sm" colour={value.budget?.colour} />
          <div className="flex flex-col">
            <span className="font-medium">{value.budget.name}</span>
            <span className="font-medium text-gray-60">{value.task.name}</span>
          </div>
        </div>
      </TableData>

      <TableData>
        <span className="whitespace-pre-wrap">{value.description || '- - -'}</span>
      </TableData>

      <TableData>
        <FormatDateTime value={value.date} format={DateTime.DATE_MED} />
      </TableData>

      <TableData>
        <span>{formatToHours(value.estimatedMinutes)}</span>
      </TableData>

      <TableData>
        <span>{formatToHours(value.durationMinutes)}</span>
      </TableData>

      <TableData>
        {value.isBillable ? (
          <div className="w-7 h-7 grid place-content-center bg-green-10 rounded-full shrink-0 mx-auto">
            <TickIcon className="text-green-90 w-4" />
          </div>
        ) : (
          <div className="w-7 h-7 grid place-content-center bg-red-10 rounded-full shrink-0 mx-auto">
            <CrossIcon className="text-red-90 w-4" />
          </div>
        )}
      </TableData>
    </TableRow>
  )
}
