import {
  Avatar,
  Badge,
  Button,
  FormatDateTime,
  FormCheckbox,
  TableData,
  TableRow,
  UsersIcon,
} from '@/components'
import { useLazyTimeout } from '@/hooks/useLazyTimeout'
import { User } from '@/types'
import { DateTime } from 'luxon'

type TeamMembersTableRow = {
  onResend: () => void
  value: User
}

export const TeamMembersTableRow = ({ onResend, value }: TeamMembersTableRow): JSX.Element => {
  const [toggled, triggerResend] = useLazyTimeout({ delay: 10000 })

  const handleResendInvite = () => {
    if (!toggled) {
      onResend()
      triggerResend()
    }
  }

  return (
    <TableRow>
      <TableData>
        <FormCheckbox name={`member-${value.id}`} />
      </TableData>

      <TableData className="px-1">
        <Avatar className="w-9 h-9">
          <UsersIcon className="w-5 h-5" />
        </Avatar>
      </TableData>

      <TableData>
        <p className="text-gray-80 font-medium">
          {value.firstname} {value.lastname}
        </p>
      </TableData>

      <TableData>
        <p className="text-gray-80">{value.email?.toLowerCase()}</p>
      </TableData>

      <TableData>
        <Badge variant="default">{value?.role?.name}</Badge>
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
        <Button variant="blank">Manage</Button>
      </TableData>
    </TableRow>
  )
}
