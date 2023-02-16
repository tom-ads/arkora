import {
  Form,
  FormCheckbox,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { useGetAccountsQuery } from '@/features/account'
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

export const TeamMembersTable = (): JSX.Element => {
  const { searchFilter, roleFilter, statusFilter } = useSelector((state: RootState) => ({
    searchFilter: state.teamMemberFilters.search,
    roleFilter: state.teamMemberFilters.role,
    statusFilter: state.teamMemberFilters.status,
  }))

  const { data: members } = useGetAccountsQuery({
    page: 1,
    role: roleFilter,
    search: searchFilter,
    status: statusFilter,
  })

  return (
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
                <TeamMembersTableRow key={member.id} value={member} />
              ))}
            </TableBody>
          </Table>
        )}
      </Form>
    </TableContainer>
  )
}
