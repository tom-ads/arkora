import ReactApexChart from 'react-apexcharts'

type TotalTimePieChartProps = {
  totalTime: number
  threshold: number
}

export const TotalTimePieChart = ({
  totalTime,
  threshold,
}: TotalTimePieChartProps): JSX.Element => {
  const normalisedTotal = ((totalTime - 0) / (threshold - 0)) * 100
  const normalisedDifference = 100 - normalisedTotal

  return (
    <ReactApexChart
      type="donut"
      series={[normalisedTotal, normalisedDifference]}
      options={{
        dataLabels: { enabled: false },
        stroke: { show: true, curve: 'smooth' },
        fill: { colors: ['#352C98', '#DFDDF5'] },
        states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
        legend: { show: false },
        tooltip: { enabled: false },
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
                  label: 'Daily Time',
                  formatter: (w) => {
                    const percentage = w.globals.seriesTotals?.[0]
                    return `${percentage.toFixed()}%`
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
