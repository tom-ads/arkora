import { FormatCurrency } from '@/components/FormatCurrency'
import { DoubleProgressBar } from '@/components/Indicators'
import { ToolTip } from '@/components/ToolTip'
import { calculatePercentage } from '@/helpers/currency'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'

type BillableProgressBarProps = {
  width: number
  billableTotal: number
  unbillableTotal: number
}

export const BillableProgressBar = ({
  billableTotal,
  unbillableTotal,
  width,
}: BillableProgressBarProps) => {
  const currencyCode = useSelector((state: RootState) => state.organisation.currency?.code)

  const grandTotal = billableTotal + unbillableTotal

  return (
    <ToolTip
      width={width}
      trigger={
        <button type="button" className="outline-none w-full">
          <DoubleProgressBar
            leftPercent={calculatePercentage(billableTotal, grandTotal)}
            rightPercent={calculatePercentage(unbillableTotal, grandTotal)}
          />
        </button>
      }
    >
      <div className="divide-y divide-gray-40 divide-dashed">
        <div className="flex justify-between items-center py-1">
          <p className="font-medium text-xs text-green-90">Billable</p>
          <p className="font-semibold text-xs text-gray-80">
            <FormatCurrency value={billableTotal} currency={currencyCode} />
          </p>
        </div>
        <div className="flex justify-between items-center py-1">
          <p className="font-medium text-xs text-red-90">Non-Billable</p>
          <p className="font-semibold text-xs text-gray-80">
            <FormatCurrency value={unbillableTotal} currency={currencyCode} />
          </p>
        </div>
      </div>
    </ToolTip>
  )
}
