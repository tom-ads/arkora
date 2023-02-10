import {
  Badge,
  DoubleProgressLineIndicator,
  FormatCurrency,
  InlineLink,
  ProgressLineIndicator,
  TableData,
  TableRow,
  ToolTip,
} from '@/components'
import { ToolTipContainer } from '@/components/ToolTip/container'
import BudgetType from '@/enums/BudgetType'
import { calculatePercentage, convertToPounds } from '@/helpers/currency'
import { RootState } from '@/stores/store'
import { Budget } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const BudgetRow = ({ budget }: { budget: Budget }): JSX.Element => {
  const { currency } = useSelector((state: RootState) => ({
    currency: state.organisation.currency,
  }))

  const allocatedBudget = useMemo(() => {
    let allocation = 0
    if (budget?.budgetType?.name === BudgetType.VARIABLE) {
      allocation = convertToPounds(budget.budget)
    } else if (budget?.budgetType?.name === BudgetType.FIXED) {
      allocation = convertToPounds(budget?.fixedPrice ?? 0)
    }
    return allocation
  }, [budget])

  const formattedMetrics = useMemo(() => {
    const metrics = {
      totalBillable: budget.totalBillable,
      totalNonBillable: budget.totalNonBillable,
      totalSpent: budget.totalSpent,
      totalRemaining: budget.totalRemaining,
      hourlyRate: budget.hourlyRate,
    }

    return Object.entries(metrics).reduce(
      (prev, [metric, value]) => ({ ...prev, [metric]: convertToPounds(value) }),
      {},
    ) as typeof metrics
  }, [budget])

  return (
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
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <FormatCurrency value={formattedMetrics?.hourlyRate} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <FormatCurrency value={allocatedBudget} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <ToolTipContainer>
            <ProgressLineIndicator
              id={`spent-tooltip-${budget.id}`}
              percent={calculatePercentage(formattedMetrics.totalSpent, allocatedBudget)}
            />
            <ToolTip id={`spent-tooltip-${budget.id}`}>
              <div className="divide-y divide-gray-40 divide-dashed">
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-gray-50">Total</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency value={allocatedBudget} currency={currency?.code} />
                  </p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-gray-50">Spent</p>
                  <p className="font-semibold text-xs text-gray-80 flex gap-1">
                    <FormatCurrency value={formattedMetrics.totalSpent} currency={currency?.code} />
                    ({calculatePercentage(formattedMetrics.totalSpent, allocatedBudget)}%)
                  </p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-gray-50">Remaining</p>
                  <p className="font-semibold text-xs text-gray-80 flex gap-1">
                    <FormatCurrency
                      value={formattedMetrics.totalRemaining}
                      currency={currency?.code}
                    />
                    ({calculatePercentage(formattedMetrics.totalRemaining, allocatedBudget)}
                    %)
                  </p>
                </div>
              </div>
            </ToolTip>
          </ToolTipContainer>
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <ToolTipContainer>
            <DoubleProgressLineIndicator
              id={`billable-tooltip-${budget.id}`}
              leftPercent={calculatePercentage(
                formattedMetrics?.totalBillable,
                formattedMetrics?.totalSpent,
              )}
              rightPercent={calculatePercentage(
                formattedMetrics?.totalNonBillable,
                formattedMetrics?.totalSpent,
              )}
            />
            <ToolTip id={`billable-tooltip-${budget.id}`}>
              <div className="divide-y divide-gray-40 divide-dashed">
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-green-90">Billable</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={formattedMetrics?.totalBillable}
                      currency={currency?.code}
                    />
                  </p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-red-90">Non-Billable</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={formattedMetrics?.totalNonBillable}
                      currency={currency?.code}
                    />
                  </p>
                </div>
              </div>
            </ToolTip>
          </ToolTipContainer>
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        <p>{budget.private ? 'Private' : 'Public'}</p>
      </TableData>
    </TableRow>
  )
}
