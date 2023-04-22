import { Avatar, Button, TableData, TableRow, UserIcon } from '@/components'
import { BillableProgressBar } from '@/components/ProgressBars'
import UserRole from '@/enums/UserRole'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import { useAuthorization } from '@/hooks/useAuthorization'
import { RootState } from '@/stores/store'
import { User } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type MemberRowProps = {
  value: User
  isPrivate: boolean
  onDelete: (id: number) => void
}

export const MemberRow = ({ onDelete, value, isPrivate }: MemberRowProps): JSX.Element => {
  const { checkPermission } = useAuthorization()

  const { authId, authRole } = useSelector((state: RootState) => ({
    authId: state.auth.user?.id,
    authRole: state.auth.user?.role?.name,
  }))

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

      <TableData>
        {authRole !== UserRole.MEMBER ? (
          formatMinutesToHourMinutes(formattedMember.spentDuration ?? 0)
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {authRole !== UserRole.MEMBER ? (
          <BillableProgressBar
            width={215}
            billableTotal={formattedMember.billableDuration}
            unbillableTotal={formattedMember.unbillableDuration}
          />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        <div className="w-full flex items-center justify-end">
          {value.id !== authId && checkPermission('project:update') && (
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
