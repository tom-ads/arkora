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
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import { calculatePercentage, convertToPounds } from '@/helpers/currency'
import { formatToHours } from '@/helpers/date'
import { RootState } from '@/stores/store'
import { Budget } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type BudgetRowProps = { budget: Budget }

export const BudgetRow = ({ budget }: BudgetRowProps): JSX.Element => {
  const { currency } = useSelector((state: RootState) => ({
    currency: state.organisation.currency,
  }))

  const formattedBudget = useMemo(() => {
    const formattedBudget = { ...budget }
    if (budget) {
      formattedBudget.totalCost = convertToPounds(budget.totalCost)
      formattedBudget.totalBillable = convertToPounds(budget.totalBillable)
      formattedBudget.totalNonBillable = convertToPounds(budget.totalNonBillable)
      formattedBudget.totalSpent = convertToPounds(budget.totalSpent)
      formattedBudget.totalRemaining = convertToPounds(budget.totalRemaining)
      formattedBudget.hourlyRate = convertToPounds(budget.hourlyRate)
    }

    return formattedBudget
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
        <Badge variant="default">
          {budget?.budgetType?.name} -{' '}
          {budget?.billableType?.name === BillableType.TOTAL_COST ? 'COST' : 'HOURS'}
        </Badge>
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE && budget.hourlyRate ? (
          <FormatCurrency value={formattedBudget?.hourlyRate} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <FormatCurrency value={formattedBudget.totalCost} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <ToolTipContainer>
            <ProgressLineIndicator
              id={`spent-tooltip-${budget.id}`}
              percent={calculatePercentage(formattedBudget.totalSpent, formattedBudget.totalCost)}
            />
            <ToolTip id={`spent-tooltip-${budget.id}`} className="!p-3">
              <div className="divide-y divide-gray-40 divide-dashed">
                <div className="flex flex-col items-start pb-[6px]">
                  <p className="font-medium text-xs text-gray-50">Total</p>
                  <div className="flex justify-between w-full">
                    <p className="font-semibold text-xs text-gray-80">
                      <FormatCurrency value={formattedBudget.totalCost} currency={currency?.code} />
                    </p>
                    <p className="font-semibold text-xs text-gray-80">
                      {formatToHours(budget.totalMinutes)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start py-[6px]">
                  <p className="font-medium text-xs text-gray-50">Spent</p>
                  <div className="flex justify-between w-full">
                    <p className="font-semibold text-xs text-gray-80 flex gap-1">
                      <FormatCurrency
                        value={formattedBudget.totalSpent}
                        currency={currency?.code}
                      />
                      ({calculatePercentage(formattedBudget.totalSpent, formattedBudget.totalCost)}
                      %)
                    </p>
                    <p className="font-semibold text-xs text-gray-80">
                      {formatToHours(budget.totalBillableMinutes + budget.totalNonBillableMinutes)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start pt-[6px]">
                  <p className="font-medium text-xs text-gray-50">Remaining</p>
                  <div className="flex justify-between w-full">
                    <p className="font-semibold text-xs text-gray-80 flex gap-1">
                      <FormatCurrency
                        value={formattedBudget.totalRemaining}
                        currency={currency?.code}
                      />
                      (
                      {calculatePercentage(
                        formattedBudget.totalRemaining,
                        formattedBudget.totalCost,
                      )}
                      %)
                    </p>
                  </div>
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
                formattedBudget?.totalBillable,
                formattedBudget?.totalSpent,
              )}
              rightPercent={calculatePercentage(
                formattedBudget?.totalNonBillable,
                formattedBudget?.totalSpent,
              )}
            />
            <ToolTip id={`billable-tooltip-${budget.id}`}>
              <div className="divide-y divide-gray-40 divide-dashed">
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-green-90">Billable</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={formattedBudget?.totalBillable}
                      currency={currency?.code}
                    />
                  </p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="font-medium text-xs text-red-90">Non-Billable</p>
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={formattedBudget?.totalNonBillable}
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
