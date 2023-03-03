import {
  DoubleCashIcon,
  Table,
  TableBody,
  TableContainer,
  TableEmpty,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { Budget } from '@/types'
import { BudgetRow } from '../BudgetRow'

type BudgetsTableProps = {
  onManageRow: (id: number) => void
  value: Budget[] | null
}

export const BudgetsTable = ({ onManageRow, value }: BudgetsTableProps): JSX.Element => {
  return (
    <>
      {value && value?.length ? (
        <TableContainer className="min-h-[400px]">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeading className="w-[32px]" first></TableHeading>
                <TableHeading className="w-[225px]">NAME</TableHeading>
                <TableHeading className="w-[160px]">TYPE</TableHeading>
                <TableHeading className="w-[100px]">RATE (HRS)</TableHeading>
                <TableHeading>BUDGET</TableHeading>
                <TableHeading className="w-[200px] 2xl:w-[230px]">SPENT</TableHeading>
                <TableHeading className="w-[200px] 2xl:w-[230px]">
                  BILLABLE / NON-BILLABLE
                </TableHeading>
                <TableHeading className="max-w-[355px]">VISIBILITY</TableHeading>
                <TableHeading className="w-[100x]" last></TableHeading>
              </TableRow>
            </TableHead>
            <TableBody>
              {value?.map((budget) => (
                <BudgetRow
                  key={budget.id}
                  budget={budget}
                  onManage={(budgetId) => onManageRow(budgetId)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableEmpty
          icon={<DoubleCashIcon />}
          title="No Budgets"
          description="Add a budget to track time and monitor allocated budget for a clients work package"
        />
      )}
    </>
  )
}
