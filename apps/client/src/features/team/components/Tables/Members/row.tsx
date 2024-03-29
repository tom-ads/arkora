import {
  Avatar,
  Badge,
  Button,
  FormatDateTime,
  FormCheckbox,
  TableData,
  TableRow,
  UserIcon,
} from '@/components'
import { useLazyTimeout } from '@/hooks/useLazyTimeout'
import { User } from '@/types'
import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'

type TeamMembersTableRowProps = {
  onResend: () => void
  value: User
}

export const TeamMembersTableRow = ({ onResend, value }: TeamMembersTableRowProps): JSX.Element => {
  const navigate = useNavigate()

  const [toggled, triggerResend] = useLazyTimeout({ delay: 10000 })

  const handleResendInvite = () => {
    if (!toggled) {
      onResend()
      triggerResend()
    }
  }

  const fullName = `${value?.firstname ?? ''}${value?.lastname ? ` ${value.lastname}` : ''}`

  return (
    <TableRow>
      <TableData>
        <FormCheckbox name={`member-${value.id}`} />
      </TableData>

      <TableData className="px-1">
        <Avatar className="w-9 h-9 uppercase">
          {value.initials || <UserIcon className="w-5 h-5" />}
        </Avatar>
      </TableData>

      <TableData>
        <p className="text-gray-80 font-medium">{fullName || '- - -'}</p>
      </TableData>

      <TableData>
        <p className="text-gray-80">{value.email?.toLowerCase()}</p>
      </TableData>

      <TableData>
        <Badge variant="default">{value?.role?.name?.replace('_', ' ')}</Badge>
      </TableData>

      <TableData>
        {value?.verifiedAt ? (
          <p className="text-gray-80">
            <FormatDateTime value={value.verifiedAt} format={DateTime.DATE_MED} />
          </p>
        ) : (
          <>
            {!value?.verifiedAt && (
              <div className="flex items-center gap-1">
                <p className="text-yellow-60">Pending</p>
                <Button variant="blank" onClick={() => handleResendInvite()} disabled={toggled}>
                  ({toggled ? 'Resent' : 'Resend Invite'})
                </Button>
              </div>
            )}
          </>
        )}
      </TableData>

      <TableData>
        <Button variant="blank" onClick={() => navigate(`/team/members/${value.id}`)}>
          Manage
        </Button>
      </TableData>
    </TableRow>
  )
}
