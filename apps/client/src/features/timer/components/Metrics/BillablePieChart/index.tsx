import ReactApexChart from 'react-apexcharts'

type BillablePieChartProps = {
  data: number[]
}

export const BillablePieChart = ({ data }: BillablePieChartProps): JSX.Element => {
  return (
    <ReactApexChart
      type="donut"
      series={data}
      options={{
        dataLabels: { enabled: false },
        labels: ['billable', 'non-billable'],
        responsive: [
          {
            breakpoint: 2000,
            options: { chart: { width: 370 } },
          },
        ],
        stroke: { show: false },
        fill: { colors: ['#61A555', '#B63A44'], opacity: 100 },
        states: { hover: { filter: {} } },
        legend: {
          show: false,
        },
        tooltip: {},
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: '65%',
              labels: {
                show: true,
                name: {
                  formatter: () => 'test',
                },
              },
            },
          },
        },
      }}
    />
  )
}
