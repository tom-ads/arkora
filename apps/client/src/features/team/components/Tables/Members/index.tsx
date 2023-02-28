import {
  Form,
  FormCheckbox,
  Table,
  TableBody,
  TableContainer,
  TableEmpty,
  TableHead,
  TableHeading,
  TableRow,
  UserIcon,
} from '@/components'
import { useGetAccountsQuery } from '@/features/account'
import { useResendInvitationMutation } from '@/features/auth'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import { TeamMembersTableRow } from './row'

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
  const { searchFilter, roleFilter, statusFilter } = useSelector((state: RootState) => ({
    searchFilter: state.teamMemberFilters.search,
    roleFilter: state.teamMemberFilters.role,
    statusFilter: state.teamMemberFilters.status,
  }))

  const [triggerResend] = useResendInvitationMutation()

  const { data: members } = useGetAccountsQuery({
    page: 1,
    role: roleFilter,
    search: searchFilter,
    status: statusFilter,
  })

  const handleAction = async (userId: number) => {
    await triggerResend({ userId })
  }

  return (
    <>
      {members && members?.length > 0 ? (
        <TableContainer>
          <Form<FormFields, typeof membersTableSchema>>
            {() => (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeading className="w-[32px]" first>
                      <FormCheckbox name="select-all" />
                    </TableHeading>
                    <TableHeading className="w-[30px]"></TableHeading>
                    <TableHeading className="w-[150px]">NAME</TableHeading>
                    <TableHeading className="w-[200px]">EMAIL</TableHeading>
                    <TableHeading className="w-[100px]">ROLE</TableHeading>
                    <TableHeading className="w-[100px]">JOINED</TableHeading>
                    <TableHeading className="w-[60px]" last></TableHeading>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members?.map((member) => (
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
      ) : (
        <TableEmpty
          icon={<UserIcon />}
          title="Team"
          btnText="Invite Members"
          btnOnClick={onCreate}
          description="Invite team members to assign them to client projects and monitor their time and cost"
        />
      )}
    </>
  )
}
