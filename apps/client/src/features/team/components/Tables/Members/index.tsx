import {
  Form,
  FormCheckbox,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  UserIcon,
} from '@/components'
import { useGetAccountsQuery } from '@/features/account'
import { useResendInvitationMutation } from '@/features/auth'
import { RootState } from '@/stores/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import { TeamMembersTableRow } from './row'
import { useToast } from '@/hooks/useToast'

type FormFields = {
  selectedMembers: number[]
}

const membersTableSchema = z.object({
  selectedMembers: z.array(z.number()).nullable(),
})

type TeamMembersTableProps = {
  onCreate: () => void
}

export const TeamMembersTable = ({ onCreate }: TeamMembersTableProps): JSX.Element => {
  const { searchFilter, roleFilter, statusFilter, authId } = useSelector((state: RootState) => ({
    searchFilter: state.teamMemberFilters.search,
    roleFilter: state.teamMemberFilters.role,
    statusFilter: state.teamMemberFilters.status,
    authId: state.auth.user?.id,
  }))

  const { errorToast } = useToast()

  const [triggerResend] = useResendInvitationMutation()

  const { data: members, isLoading } = useGetAccountsQuery({
    page: 1,
    role: roleFilter,
    search: searchFilter,
    status: statusFilter,
  })

  const handleAction = async (userId: number) => {
    await triggerResend({ userId }).catch(() =>
      errorToast('Unable to resent invite. Please try again later.'),
    )
  }

  const filteredMembers = useMemo(() => {
    return members?.filter((member) => member?.id !== authId)
  }, [members])

  return (
    <TableContainer
      className="min-h-[738px]"
      emptyState={{
        isEmpty: !filteredMembers?.length && !isLoading,
        icon: <UserIcon />,
        title: 'No Team Members',
        btnText: 'Invite Members',
        onClick: onCreate,
        description:
          'Invite team members to assign them to client projects and monitor their time and cost',
      }}
    >
      <Form<FormFields, typeof membersTableSchema>>
        {() => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeading first>
                  <FormCheckbox name="select-all" />
                </TableHeading>
                <TableHeading></TableHeading>
                <TableHeading>NAME</TableHeading>
                <TableHeading>EMAIL</TableHeading>
                <TableHeading>ROLE</TableHeading>
                <TableHeading>JOINED</TableHeading>
                <TableHeading last></TableHeading>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers?.map((member) => (
                <TeamMembersTableRow
                  key={member.id}
                  value={member}
                  onResend={() => handleAction(member.id)}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </Form>
    </TableContainer>
  )
}
