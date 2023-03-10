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

type TableProps = {
  onManage: (id: number) => void
}

export const BudgetsTable = ({ onManage }: TableProps): JSX.Element => {
  const { projectId } = useParams()

  const { data: projectBudgets, isLoading } = useGetBudgetsQuery(
    { projectId },
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
          'Add a budget to track time and monitor allocated budget for a clients work package',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[32px]" first></TableHeading>
            <TableHeading className="w-[225px]">NAME</TableHeading>
            <TableHeading className="w-[160px]">TYPE</TableHeading>
            <TableHeading className="w-[100px]">RATE (HRS)</TableHeading>
            <TableHeading>BUDGET</TableHeading>
            <TableHeading className="w-[200px] 2xl:w-[230px]">SPENT</TableHeading>
            <TableHeading className="w-[200px] 2xl:w-[230px]">BILLABLE / NON-BILLABLE</TableHeading>
            <TableHeading className="w-[95px]">VISIBILITY</TableHeading>
            <TableHeading className="w-[100px]" last></TableHeading>
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