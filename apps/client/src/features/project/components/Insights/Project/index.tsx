import { FormatCurrency } from '@/components'
import { useGetProjectInsightsQuery } from '../../../api'
import { formatToHours } from '@/helpers/date'
import classNames from 'classnames'
import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { GetProjectInsightsResponse } from '../../../api/types/response'
import { convertToPounds } from '@/helpers/currency'
import Status from '@/enums/Status'

export const ProjectInsights = (): JSX.Element => {
  const { projectId } = useParams()

  const { data: insights } = useGetProjectInsightsQuery(projectId!, { skip: !projectId })

  const formattedInsights = useMemo(() => {
    const result = { ...insights } as GetProjectInsightsResponse
    if (insights) {
      result.allocatedCost = convertToPounds(result.allocatedCost)
      result.usedCost = convertToPounds(result.usedCost)
      result.billableCost = convertToPounds(result.billableCost)
      result.unbillableCost = convertToPounds(result.unbillableCost)
      result.revenue = convertToPounds(result.revenue)
      result.expenses = convertToPounds(result.expenses)
      result.profit = convertToPounds(result.profit)
      result.remainingCost = convertToPounds(result.remainingCost)
    }

    return result
  }, [insights])

  return (
    <div className="bg-white rounded shadow-glow">
      {/* Insights Controls */}
      <div className="border-b border-dashed border-gray-30 px-[21px] py-4">
        <div className="flex items-center justify-between">
          <p>01st Jan - 24th June </p>
          <p
            className={classNames('text-sm font-medium capitalize flex items-center gap-3', {
              'text-green-90': formattedInsights?.status === Status.ACTIVE,
              'text-yellow-90': formattedInsights?.status === Status.PENDING,
              'text-gray-70': formattedInsights?.status === Status.INACTIVE,
            })}
          >
            <span>{formattedInsights.status?.toLowerCase()} Project</span>
            <div className="rounded-full w-1 h-1 flex-shrink-0 bg-gray-80"></div>
            <span className="text-gray-90">{formattedInsights.private ? 'Private' : 'Public'}</span>
          </p>
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
                  {formatToHours(formattedInsights.allocatedDuration)}
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
                  {formatToHours(formattedInsights.usedDuration)}
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
                  {formatToHours(formattedInsights.billableDuration)}
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
                  {formatToHours(formattedInsights.unbillableDuration)}
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
                  {formatToHours(formattedInsights.remainingDuration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
