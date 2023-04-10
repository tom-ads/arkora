import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  UserIcon,
} from '@/components'
import { useGetBudgetQuery } from './../../../api'
import { useParams } from 'react-router-dom'
import { BudgetMembersSkeletonRow, MemberRow } from '../MemberRow'
import { useGetBudgetMembersQuery } from '@/features/budget_members'

type TableProps = {
  onDelete: (id: number) => void
}

export const BudgetMembersTable = ({ onDelete }: TableProps): JSX.Element => {
  const { budgetId } = useParams()

  const { data: budget } = useGetBudgetQuery(budgetId!, { skip: !budgetId })

  const { data: members, isLoading: loadingMembers } = useGetBudgetMembersQuery(
    { budgetId: budgetId! },
    { skip: !budgetId },
  )

  return (
    <TableContainer
      className="min-h-[778px]"
      emptyState={{
        isEmpty: !members?.length && !loadingMembers,
        icon: <UserIcon />,
        title: 'No Members Assigned',
        description: 'Assign members to the budget, so they can track their time against it',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[220px]"></TableHeading>
            <TableHeading className="w-[210px]">Email</TableHeading>
            <TableHeading className="w-[100px]">SPENT</TableHeading>
            <TableHeading className="w-[150px]">BILLABLE / NON-BILLABLE</TableHeading>
            <TableHeading className="w-[100px]" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingMembers ? (
            <>
              {Array.from({ length: 10 }).map((_, idx) => (
                <BudgetMembersSkeletonRow key={idx} />
              ))}
            </>
          ) : (
            <>
              {members?.map((member) => (
                <MemberRow
                  onDelete={onDelete}
                  key={member.id}
                  value={member}
                  isPrivate={budget?.private ?? true}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
