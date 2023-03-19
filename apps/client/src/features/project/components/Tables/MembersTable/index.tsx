import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  UserIcon,
} from '@/components'
import { useGetAccountsInsightsQuery } from '@/features/account'
import { useParams } from 'react-router-dom'
import { MemberRow } from '../MemberRow'

type TableProps = {
  onDelete: (id: number) => void
}

export const MembersTable = ({ onDelete }: TableProps): JSX.Element => {
  const { projectId } = useParams()

  const { data: accounts, isLoading } = useGetAccountsInsightsQuery(
    { projectId },
    { skip: !projectId },
  )

  return (
    <TableContainer
      className="min-h-[778px]"
      emptyState={{
        isEmpty: !accounts?.length && !isLoading,
        icon: <UserIcon />,
        title: 'No Members Assigned',
        description:
          'Add members to the project, so they can be assigned to budgets for tracking time',
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
          {accounts?.map((value) => (
            <MemberRow onDelete={onDelete} key={value.id} value={value} />
          ))}
          {/* {isLoading ? (
        <>
          {Array.from({ length: 10 }).map((_, idx) => (
            <BudgetSkeletonRow key={idx} />
          ))}
        </>
      ) : (
        <>
          {projectBudgets?.map((budget) => (
            <BudgetRow
              key={budget.id}
              value={budget}
              onManage={(budgetId) => onManage(budgetId)}
            />
          ))}
        </>
      )} */}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
