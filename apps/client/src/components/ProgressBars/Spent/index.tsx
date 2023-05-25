import { FormatCurrency } from '@/components/FormatCurrency'
import { SingleProgressBar } from '@/components/Indicators'
import { ToolTip } from '@/components/ToolTip'
import { calculatePercentage } from '@/helpers/currency'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import { BaseMetrics } from '@/types'

type RequiredMetics = Omit<BaseMetrics, 'billableDuration' | 'unbillableDuration'>

type SpentProgressBarProps = RequiredMetics & {
  width: number
}

export const SpentProgressBar = ({
  billableCost,
  unbillableCost,
  allocatedBudget,
  allocatedDuration,
  width,
}: SpentProgressBarProps): JSX.Element => {
  const spentCost = billableCost + unbillableCost
  const remainingBudget = allocatedBudget - spentCost

  return (
    <ToolTip
      width={width}
      trigger={
        <button type="button" className="outline-none w-full">
          <SingleProgressBar percent={calculatePercentage(spentCost, allocatedBudget)} />
        </button>
      }
    >
      <div className="divide-y divide-gray-40 divide-dashed">
        <div className="flex flex-col items-start pb-[6px]">
          <p className="font-medium text-xs text-gray-50">Total</p>
          <div className="flex justify-between w-full">
            <p className="font-semibold text-xs text-gray-80">
              <FormatCurrency value={allocatedBudget} />
            </p>
            <p className="font-semibold text-xs text-gray-80">
              {formatMinutesToHourMinutes(allocatedDuration)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start py-[6px]">
          <p className="font-medium text-xs text-gray-50">
            Spent ({calculatePercentage(spentCost, allocatedBudget)}
            %)
          </p>
          <div className="flex justify-between w-full">
            <p className="font-semibold text-xs text-gray-80 flex gap-1">
              <FormatCurrency value={spentCost} />
            </p>
            <p className="font-semibold text-xs text-gray-80">
              {formatMinutesToHourMinutes(spentCost)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start pt-[6px]">
          <p className="font-medium text-xs text-gray-50">
            Remaining ({calculatePercentage(remainingBudget, allocatedBudget)}
            %)
          </p>
          <div className="flex justify-between w-full">
            <p className="font-semibold text-xs text-gray-80 flex gap-1">
              <FormatCurrency value={remainingBudget} />
            </p>
          </div>
        </div>
      </div>
    </ToolTip>
  )
}
