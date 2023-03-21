import {
  Badge,
  Button,
  DoubleProgressLineIndicator,
  FormatCurrency,
  InlineLink,
  ProgressLineIndicator,
  SkeletonBox,
  TableData,
  TableRow,
  ToolTip,
} from '@/components'
import BudgetType from '@/enums/BudgetType'
import { calculatePercentage, convertToPounds } from '@/helpers/currency'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import { RootState } from '@/stores/store'
import { Budget } from '@/types'
import { TableRowBaseProps } from '@/types/TableRow'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type RowProps = TableRowBaseProps<Budget>

export const BudgetRow = ({ value, onManage }: RowProps): JSX.Element => {
  const { currency } = useSelector((state: RootState) => ({
    currency: state.organisation.currency,
  }))

  const handleManage = () => {
    if (onManage) {
      onManage(value.id)
    }
  }

  const formattedBudget = useMemo(() => {
    const transformedBudget = { ...value }
    if (value) {
      transformedBudget.allocatedBudget = convertToPounds(value.allocatedBudget)
      transformedBudget.billableCost = convertToPounds(value.billableCost)
      transformedBudget.unbillableCost = convertToPounds(value.unbillableCost)
      transformedBudget.spentCost = convertToPounds(value.spentCost)
      transformedBudget.remainingCost = convertToPounds(value.remainingCost)
      transformedBudget.hourlyRate = convertToPounds(value.hourlyRate)
    }

    return transformedBudget
  }, [value])

  return (
    <TableRow>
      <TableData>
        <div
          className="w-2 h-9 flex flex-col grow rounded-lg"
          style={{ backgroundColor: value.colour ?? 'black' }}
        ></div>
      </TableData>

      <TableData className="truncate">
        <InlineLink className="font-medium truncate" to={`/budgets/${value.id}`}>
          {value.name}
        </InlineLink>
      </TableData>

      <TableData>
        <Badge variant="default">{value?.budgetType?.name}</Badge>
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE && value.hourlyRate ? (
          <FormatCurrency value={formattedBudget?.hourlyRate} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE ? (
          <FormatCurrency value={formattedBudget.allocatedBudget} currency={currency?.code} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE ? (
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
                    {formatMinutesToHourMinutes(value.allocatedDuration)}
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
                    {formatMinutesToHourMinutes(value.billableDuration + value.unbillableDuration)}
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
        {value.budgetType?.name !== BudgetType.NON_BILLABLE ? (
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
        <p>{value.private ? 'Private' : 'Public'}</p>
      </TableData>

      <TableData>
        <Button variant="blank" onClick={handleManage}>
          Manage
        </Button>
      </TableData>
    </TableRow>
  )
}

export const BudgetSkeletonRow = (): JSX.Element => {
  return (
    <TableRow>
      <TableData>
        <SkeletonBox height={36} width={14} className="rounded-lg" />
      </TableData>

      <TableData>
        <SkeletonBox height={20} randomWidth />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={50} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={50} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={100} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={170} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={170} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={60} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={60} />
      </TableData>
    </TableRow>
  )
}
