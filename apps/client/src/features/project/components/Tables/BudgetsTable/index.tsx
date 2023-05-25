import {
  DoubleCashIcon,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { useGetBudgetsQuery } from '@/features/budget'
import { useParams } from 'react-router-dom'
import { BudgetRow, BudgetSkeletonRow } from '../BudgetRow'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import UserRole from '@/enums/UserRole'

type TableProps = {
  onManage: (id: number) => void
}

export const BudgetsTable = ({ onManage }: TableProps): JSX.Element => {
  const { projectId } = useParams()

  const authUser = useSelector((state: RootState) => state.auth.user)

  const { data: projectBudgets, isLoading } = useGetBudgetsQuery(
    { projectId: parseInt(projectId!, 10), includeProject: true },
    { skip: !projectId },
  )

  return (
    <TableContainer
      className="min-h-[778px]"
      emptyState={{
        isEmpty: !projectBudgets?.length && !isLoading,
        icon: <DoubleCashIcon />,
        title: 'No Budgets Found',
        description:
          authUser?.role?.name === UserRole.MEMBER
            ? 'No budgets for this project have been assigned to you, contact your manager to get assigned!'
            : 'Add a budget to track time and monitor allocated budget for a clients work package',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading first></TableHeading>
            <TableHeading>NAME</TableHeading>
            <TableHeading>TYPE</TableHeading>
            <TableHeading>RATE (HRS)</TableHeading>
            <TableHeading>BUDGET</TableHeading>
            <TableHeading>SPENT</TableHeading>
            <TableHeading>BILLABLE / NON-BILLABLE</TableHeading>
            <TableHeading>VISIBILITY</TableHeading>
            <TableHeading className="w-10" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
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
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
