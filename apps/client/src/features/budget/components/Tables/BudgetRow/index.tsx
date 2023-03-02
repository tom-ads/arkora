import {
  Badge,
  Button,
  DoubleProgressLineIndicator,
  FormatCurrency,
  InlineLink,
  ProgressLineIndicator,
  TableData,
  TableRow,
  ToolTip,
} from '@/components'
import BudgetType from '@/enums/BudgetType'
import { calculatePercentage, convertToPounds } from '@/helpers/currency'
import { formatToHours } from '@/helpers/date'
import { RootState } from '@/stores/store'
import { Budget } from '@/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type BudgetRowProps = {
  onManage: (id: number) => void
  budget: Budget
}

export const BudgetRow = ({ onManage, budget }: BudgetRowProps): JSX.Element => {
  const { currency } = useSelector((state: RootState) => ({
    currency: state.organisation.currency,
  }))

  const formattedBudget = useMemo(() => {
    const formattedBudget = { ...budget }
    if (budget) {
      formattedBudget.allocatedBudget = convertToPounds(budget.allocatedBudget)
      formattedBudget.billableCost = convertToPounds(budget.billableCost)
      formattedBudget.unbillableCost = convertToPounds(budget.unbillableCost)
      formattedBudget.spentCost = convertToPounds(budget.spentCost)
      formattedBudget.remainingCost = convertToPounds(budget.remainingCost)
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

      <TableData className="truncate">
        <InlineLink className="font-medium truncate" to={`/budgets/${budget.id}`}>
          {budget.name}
        </InlineLink>
      </TableData>

      <TableData>
        <Badge variant="default">{budget?.budgetType?.name}</Badge>
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
          <FormatCurrency value={formattedBudget.allocatedBudget} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <ToolTip
            width={198}
            trigger={
              <ProgressLineIndicator
                percent={calculatePercentage(
                  formattedBudget.spentCost,
                  formattedBudget.allocatedBudget,
                )}
              />
            }
          >
            <div className="divide-y divide-gray-40 divide-dashed">
              <div className="flex flex-col items-start pb-[6px]">
                <p className="font-medium text-xs text-gray-50">Total</p>
                <div className="flex justify-between w-full">
                  <p className="font-semibold text-xs text-gray-80">
                    <FormatCurrency
                      value={formattedBudget.allocatedBudget}
                      currency={currency?.code}
                    />
                  </p>
                  <p className="font-semibold text-xs text-gray-80">
                    {formatToHours(budget.allocatedDuration)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start py-[6px]">
                <p className="font-medium text-xs text-gray-50">Spent</p>
                <div className="flex justify-between w-full">
                  <p className="font-semibold text-xs text-gray-80 flex gap-1">
                    <FormatCurrency value={formattedBudget.spentCost} currency={currency?.code} />(
                    {calculatePercentage(
                      formattedBudget.spentCost,
                      formattedBudget.allocatedBudget,
                    )}
                    %)
                  </p>
                  <p className="font-semibold text-xs text-gray-80">
                    {formatToHours(budget.billableDuration + budget.unbillableDuration)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start pt-[6px]">
                <p className="font-medium text-xs text-gray-50">Remaining</p>
                <div className="flex justify-between w-full">
                  <p className="font-semibold text-xs text-gray-80 flex gap-1">
                    <FormatCurrency
                      value={formattedBudget.remainingCost}
                      currency={currency?.code}
                    />
                    (
                    {calculatePercentage(
                      formattedBudget.remainingCost,
                      formattedBudget.allocatedBudget,
                    )}
                    %)
                  </p>
                </div>
              </div>
            </div>
          </ToolTip>
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {budget.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <ToolTip
            width={198}
            trigger={
              <DoubleProgressLineIndicator
                leftPercent={calculatePercentage(
                  formattedBudget?.billableCost,
                  formattedBudget?.spentCost,
                )}
                rightPercent={calculatePercentage(
                  formattedBudget?.unbillableCost,
                  formattedBudget?.spentCost,
                )}
              />
            }
          >
            <div className="divide-y divide-gray-40 divide-dashed">
              <div className="flex justify-between items-center py-1">
                <p className="font-medium text-xs text-green-90">Billable</p>
                <p className="font-semibold text-xs text-gray-80">
                  <FormatCurrency value={formattedBudget?.billableCost} currency={currency?.code} />
                </p>
              </div>
              <div className="flex justify-between items-center py-1">
                <p className="font-medium text-xs text-red-90">Non-Billable</p>
                <p className="font-semibold text-xs text-gray-80">
                  <FormatCurrency
                    value={formattedBudget?.unbillableCost}
                    currency={currency?.code}
                  />
                </p>
              </div>
            </div>
          </ToolTip>
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        <p>{budget.private ? 'Private' : 'Public'}</p>
      </TableData>

      <TableData>
        <Button variant="blank" onClick={() => onManage(budget.id)}>
          Manage
        </Button>
      </TableData>
    </TableRow>
  )
}
