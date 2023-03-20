import {
  Avatar,
  Button,
  DoubleProgressLineIndicator,
  TableData,
  TableRow,
  ToolTip,
  UserIcon,
} from '@/components'
import { calculatePercentage } from '@/helpers/currency'
import { formatToHours } from '@/helpers/date'
import { RootState } from '@/stores/store'
import { User } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type MemberRowProps = {
  onDelete: (id: number) => void
  value: User
  isPrivate: boolean
}

export const MemberRow = ({ onDelete, value, isPrivate }: MemberRowProps): JSX.Element => {
  const authId = useSelector((state: RootState) => state.auth.user?.id)

  const formattedMember = useMemo(() => {
    const member = { ...value }
    if (member) {
      member.spentDuration = member.billableDuration + member.unbillableDuration
    }
    return member
  }, [value])

  return (
    <TableRow key={value.id}>
      <TableData>
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 uppercase">
            {value.initials || <UserIcon className="w-5 h-5" />}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-80">
              {value.firstname} {value.lastname}
            </span>
            <span className="text-xs text-gray-50 font-medium">{value.role.name}</span>
          </div>
        </div>
      </TableData>

      <TableData>{value.email?.toLowerCase()}</TableData>

      <TableData>{formatToHours(formattedMember.spentDuration ?? 0)}</TableData>

      <TableData>
        <ToolTip
          width={215}
          trigger={
            <DoubleProgressLineIndicator
              leftPercent={calculatePercentage(
                formattedMember?.billableDuration,
                formattedMember?.spentDuration,
              )}
              rightPercent={calculatePercentage(
                formattedMember?.unbillableDuration,
                formattedMember?.spentDuration,
              )}
            />
          }
        >
          <div className="divide-y divide-gray-40 divide-dashed">
            <div className="flex justify-between items-center py-1">
              <p className="font-medium text-xs text-green-90">Billable</p>
              <p className="font-semibold text-xs text-gray-80">
                {formatToHours(formattedMember.billableDuration)}
              </p>
            </div>
            <div className="flex justify-between items-center py-1">
              <p className="font-medium text-xs text-red-90">Non-Billable</p>
              <p className="font-semibold text-xs text-gray-80">
                {formatToHours(formattedMember.unbillableDuration)}
              </p>
            </div>
          </div>
        </ToolTip>
      </TableData>

      <TableData>
        <div className="w-full flex items-center justify-end">
          {value.id !== authId && (
            <Button
              variant="blank"
              onClick={() => onDelete(formattedMember.id)}
              disabled={!isPrivate}
              danger
            >
              Remove
            </Button>
          )}
        </div>
      </TableData>
    </TableRow>
  )
}
