import {
  Badge,
  FormatCurrency,
  InlineLink,
  ProgressLineIndicator,
  TableData,
  TableRow,
  ToolTip,
} from '@/components'
import { ToolTipContainer } from '@/components/ToolTip/container'
import BudgetType from '@/enums/BudgetType'
import { convertToPounds } from '@/helpers/currency'
import { RootState } from '@/stores/store'
import { Budget } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const BudgetRow = ({ budget }: { budget: Budget }): JSX.Element => {
  const { currency } = useSelector((state: RootState) => ({
    currency: state.organisation.currency,
  }))

  const allocatedBudget = useMemo(() => {
    let allocation = null
    if (BudgetType.VARIABLE) {
      allocation = convertToPounds(budget.budget)
    } else if (BudgetType.FIXED) {
      allocation = convertToPounds(budget?.fixedPrice ?? 0)
    }

    return allocation
  }, [budget])

  return (
    <>
      <TableRow>
        <TableData>
          <div
            className="w-2 h-9 flex flex-col grow rounded-lg"
            style={{ backgroundColor: budget.colour ?? 'black' }}
          ></div>
        </TableData>

        <TableData>
          <InlineLink className="font-medium" to={`/budgets/${budget.id}`}>
            {budget.name}
          </InlineLink>
        </TableData>

        <TableData>
          <Badge variant="default">{budget?.budgetType?.name}</Badge>
        </TableData>

        <TableData>
          <FormatCurrency value={budget.hourlyRate} currency={currency?.code} />
        </TableData>

        <TableData>
          <FormatCurrency value={allocatedBudget} currency={currency?.code} />
        </TableData>

        <TableData>
          <ToolTipContainer>
            <ProgressLineIndicator
              id={`spent-tooltip-${budget.id}`}
              percent={(budget.totalSpent / budget.budget) * 100}
            />
            <ToolTip id={`spent-tooltip-${budget.id}`}>
              <div className="divide-y divide-gray-40 divide-dashed">
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-gray-50">Total Budget</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency value={allocatedBudget} currency={currency?.code} />
                  </p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-gray-50">Spent Budget</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={convertToPounds(budget.totalSpent)}
                      currency={currency?.code}
                    />
                  </p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-gray-50">Remaining Budget</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={convertToPounds(budget.totalRemaining)}
                      currency={currency?.code}
                    />
                  </p>
                </div>
              </div>
            </ToolTip>
          </ToolTipContainer>
        </TableData>
      </TableRow>
    </>
  )
}
