import { calculatePercentage } from '@/helpers/currency'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import { sum } from 'lodash'
import ReactApexChart from 'react-apexcharts'

type BillablePieChartProps = {
  billableDuration: number
  unbillableDuration: number
}

export const BillablePieChart = ({
  billableDuration = 0,
  unbillableDuration = 0,
}: BillablePieChartProps): JSX.Element => {
  const seriesData = [
    billableDuration,
    unbillableDuration,
    !billableDuration && !unbillableDuration ? 100 : 0,
  ]

  return (
    <ReactApexChart
      type="donut"
      series={seriesData}
      options={{
        dataLabels: { enabled: false },
        labels: ['billable', 'non-billable'],
        stroke: { show: true },
        fill: { colors: ['#61A555', '#B63A44', '#EBEFF4'] },
        states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
        legend: { show: false },
        tooltip: {
          custom: function ({ series }) {
            return `
              <div class="divide-y divide-gray-40 divide-dashed min-w-[200px]">
                <div class="flex justify-between items-center py-1 gap-2">
                  <p class="font-medium text-sm text-green-90">Billable</p>
                  <p class="font-semibold text-sm text-gray-80">
                    ${formatMinutesToHourMinutes(series[0])}
                  </p>
                </div>
                <div class="flex justify-between items-center py-1 gap-2">
                  <p class="font-medium text-sm text-red-90">Non-Billable</p>
                  <p class="font-semibold text-sm text-gray-80">
                    ${formatMinutesToHourMinutes(series[1])}
                  </p>
                </div>
              </div>
            `
          },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: '70%',
              labels: {
                show: true,
                name: {
                  color: '#352C98',
                  fontSize: '16px',
                },
                value: {
                  color: '#2E3F5A',
                  fontSize: '20px',
                  fontWeight: '600',
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Daily Billable',
                  formatter: function (w) {
                    const billableDuration = w.globals?.seriesTotals?.[0] ?? 0
                    const totalTime = sum(w.globals?.seriesTotals)
                    return `${calculatePercentage(billableDuration, totalTime, 0)}%`
                  },
                },
              },
            },
          },
        },
      }}
    />
  )
}
