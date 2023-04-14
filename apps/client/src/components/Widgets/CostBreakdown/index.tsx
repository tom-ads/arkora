import classNames from 'classnames'
import Status from '@/enums/Status'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import { LockIcon, OpenLockIcon } from '@/components/Icons'
import { FormatCurrency } from '@/components/FormatCurrency'
import { useMemo } from 'react'
import { convertToPounds } from '@/helpers/currency'
import { BudgetBaseMetrics } from '@/types'

type CostBreakdownValue = BudgetBaseMetrics & {
  status?: Status
  private: boolean
}

type CostBreakdownWidgetProps = {
  value: CostBreakdownValue
}

export const CostBreakdownWidget = ({ value }: CostBreakdownWidgetProps): JSX.Element => {
  const formattedInsights = useMemo(() => {
    const remainCost = value.allocatedBudget - (value.billableCost + value.unbillableCost)
    const remainDur = value.allocatedDuration - (value.unbillableDuration + value.billableDuration)
    return {
      ...value,
      allocatedCost: convertToPounds(value.allocatedBudget),
      usedCost: convertToPounds(value.billableCost + value.unbillableCost),
      usedDuration: value.billableDuration + value.unbillableDuration,

      billableCost: convertToPounds(value.billableCost),
      unbillableCost: convertToPounds(value.unbillableCost),

      revenue: convertToPounds(value.billableCost + value.unbillableCost),
      expenses: convertToPounds(value.unbillableCost),
      profit: convertToPounds(value.billableCost - value.unbillableCost),

      remainingCost: convertToPounds(remainCost),
      remainingDuration: remainDur,
    }
  }, [value])

  return (
    <div className="bg-white rounded shadow-glow">
      {/* Insights Controls */}
      <div className="border-b border-dashed border-gray-30 px-[21px] py-4">
        <div className="flex items-center justify-between">
          <p>01st Jan - 24th June </p>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 text-gray-80">
                {formattedInsights.private ? <LockIcon /> : <OpenLockIcon />}
              </div>
              <span className="text-sm font-medium text-gray-80">
                {formattedInsights.private ? 'Private' : 'Public'}
              </span>
            </div>
            {formattedInsights.status && (
              <>
                <span>-</span>
                <p
                  className={classNames('text-sm font-medium capitalize flex items-center gap-3', {
                    'text-green-90': formattedInsights?.status === Status.ACTIVE,
                    'text-yellow-90': formattedInsights?.status === Status.PENDING,
                    'text-gray-70': formattedInsights?.status === Status.INACTIVE,
                  })}
                >
                  <span>{formattedInsights.status?.toLowerCase()} Project</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 grid-rows-1 divide-x divide-dashed divide-gray-30 px-[21px]">
        <div className="pr-[22px] pt-[18px] pb-4">
          <p className="font-medium text-gray-50 text-sm mb-3">Cost</p>
          <div className="space-y-2">
            <div className="space-y-[2px]">
              <p className="text-sm text-gray-70">Allocated</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-100">
                  <FormatCurrency value={formattedInsights.allocatedCost} />
                </p>
                <p className="text-sm font-medium text-gray-100">
                  {formatMinutesToHourMinutes(formattedInsights.allocatedDuration)}
                </p>
              </div>
            </div>

            <div className="space-y-[2px]">
              <p className="text-sm text-gray-70">Used</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-100">
                  <FormatCurrency value={formattedInsights.usedCost} />
                </p>
                <p className="text-sm font-medium text-gray-100">
                  {formatMinutesToHourMinutes(formattedInsights.usedDuration)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-[22px] pt-[18px] pb-4">
          <p className="font-medium text-gray-50 text-sm mb-3">Spent</p>
          <div className="space-y-2">
            <div className="space-y-[2px]">
              <p className="text-sm text-gray-70">Billable</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-90">
                  <FormatCurrency value={formattedInsights.billableCost} />
                </p>
                <p className="text-sm font-medium text-gray-100">
                  {formatMinutesToHourMinutes(formattedInsights.billableDuration)}
                </p>
              </div>
            </div>

            <div className="space-y-[2px]">
              <p className="text-sm text-gray-70">Non-billable</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-red-90">
                  <FormatCurrency value={formattedInsights.unbillableCost} />
                </p>
                <p className="text-sm font-medium text-gray-100">
                  {formatMinutesToHourMinutes(formattedInsights.unbillableDuration)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pl-[22px] pt-[18px] pb-4">
          <p className="font-medium text-gray-50 text-sm mb-3">Summary</p>
          <div className="divide-y divide-dashed divide-gray-30">
            <div className="flex items-center justify-between pb-2">
              <div className="space-y-[2px]">
                <p className="text-sm text-gray-70">Gross Profit</p>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-100">
                    <FormatCurrency value={formattedInsights.revenue} />
                  </p>
                </div>
              </div>

              <div className="space-y-[2px]">
                <p className="text-sm text-gray-70">Expenses</p>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-100">
                    <FormatCurrency value={formattedInsights.expenses} />
                  </p>
                </div>
              </div>

              <div className="space-y-[2px]">
                <p className="text-sm text-gray-70 pr-2">Net Profit</p>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-100">
                    <FormatCurrency
                      value={formattedInsights.profit}
                      className={classNames({
                        'text-red-90': formattedInsights.profit < 0,
                        'text-green-90': formattedInsights.profit > 0,
                      })}
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-[2px] pt-2">
              <p className="text-sm text-gray-70">Remaining</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-100">
                  <FormatCurrency value={formattedInsights.remainingCost} />
                </p>
                <p className="text-sm font-medium text-gray-100">
                  {formatMinutesToHourMinutes(formattedInsights.remainingDuration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
