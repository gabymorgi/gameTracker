import { NoData } from '@/components/ui/NoData'
import { useQuery } from '@/hooks/useFetch'
import { $SafeAny } from '@/ts'
import { Spin } from 'antd'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ChartOptions,
} from 'chart.js'
import { format, parse } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
)

const labels = ['0-8', '9-13', '14-17', '18-20']
const colors = [0, 58, 150, 194]

const WordsLearntOptions: (total: number) => ChartOptions<'line'> = (
  total,
) => ({
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Words Learnt (${total})`,
      color: '#EEE',
      font: {
        size: 24,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#EEE',
        font: {
          size: 14,
        },
      },
      grid: {
        color: '#444',
      },
    },
    x: {
      ticks: {
        color: '#EEE',
        font: {
          size: 14,
        },
      },
      grid: {
        color: '#444',
      },
    },
  },
})

function dataValueTransform(value: number) {
  if (value === 0) return 0
  if (value === 1) return 0.5
  return Math.log2(value)
}

const InProgresOptions: (total: number) => ChartOptions<'bar'> = (total) => ({
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: `In progress (${total})`,
      color: '#EEE',
      font: {
        size: 24,
      },
    },
    legend: {
      labels: {
        color: '#EEE',
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: $SafeAny) {
          return `${labels[tooltipItem.datasetIndex]}: ${tooltipItem.dataset.oriData[tooltipItem.dataIndex]}`
        },
      },
    },
  },
  responsive: true,
  scales: {
    y: {
      grid: {
        color: '#444',
      },
      type: 'linear',
      ticks: {
        color: '#EEE',
        font: {
          size: 14,
        },
        callback: function (value: string | number) {
          // Revert log2 transformation
          // 0 -> 0, 1 -> 2, 2 -> 4, 3 -> 8
          return value && Math.pow(2, Number(value))
        },
      },
    },
    x: {
      grid: {
        color: '#444',
      },
      ticks: {
        color: '#EEE',
        font: {
          size: 14,
        },
      },
    },
  },
})

function Statistics() {
  const { data, fetchData, loading } = useQuery('words/statistics')

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const LearntChart = useMemo(() => {
    if (!data) return
    const labels = data.learnt.map((d) =>
      format(parse(d.date, 'yyyy-MM', new Date()), 'MMM yy'),
    )
    const values = data.learnt.map((d) => d.amount)
    return {
      labels,
      values,
      options: WordsLearntOptions(values.reduce((acc, curr) => acc + curr, 0)),
    }
  }, [data])

  const InProgressChart = useMemo(() => {
    if (!data) return
    const keys = Object.keys(data.inProgress)
    const datasets = [0, 1, 2, 3].map((i) => ({
      label: `${labels[i]} (${keys.reduce((acc, curr) => acc + data.inProgress[Number(curr)][i], 0)})`,
      oriData: keys.map((k) => data.inProgress[Number(k)][i]),
      data: keys.map((k) => dataValueTransform(data.inProgress[Number(k)][i])),
      backgroundColor: `hsl(${colors[i]}, 100%, 10%)`,
      borderColor: `hsl(${colors[i]}, 100%, 40%)`,
      borderWidth: 2,
    }))
    return {
      labels: keys.map(
        (k) =>
          `P${k} (${data.inProgress[Number(k)].reduce((a, c) => a + c, 0)})`,
      ),
      datasets,
      options: InProgresOptions(
        datasets.reduce(
          (acc, curr) => acc + curr.oriData.reduce((a, c) => a + c, 0),
          0,
        ),
      ),
    }
  }, [data])

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <div style={{ height: '30vh', minHeight: '300px', width: '100%' }}>
        {LearntChart ? (
          <Line
            datasetIdKey="id"
            data={{
              labels: LearntChart.labels,
              datasets: [
                {
                  data: LearntChart.values,
                  fill: true,
                  borderColor: '#8F8',
                  cubicInterpolationMode: 'monotone',
                },
              ],
            }}
            options={LearntChart.options}
          />
        ) : (
          <NoData />
        )}
      </div>
      <div style={{ height: '40vh', minHeight: '400px', width: '100%' }}>
        {InProgressChart ? (
          <Bar options={InProgressChart.options} data={InProgressChart} />
        ) : (
          <NoData />
        )}
      </div>
    </>
  )
}

export default Statistics
