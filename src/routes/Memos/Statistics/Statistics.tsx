import { useQuery } from '@/hooks/useFetch'
import { NoData } from '@/routes/Games/GameList/Charts/NoData'
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
const colors = [
  'hsl(0, 100%, 40%)',
  'hsl(58, 100%, 40%)',
  'hsl(150, 100%, 40%)',
  'hsl(194, 100%, 40%)',
]

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
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      grid: {
        color: '#444',
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
      data: keys.map((k) => data.inProgress[Number(k)][i]),
      backgroundColor: colors[i],
    }))
    return {
      labels: keys,
      datasets,
      options: InProgresOptions(
        datasets.reduce(
          (acc, curr) => acc + curr.data.reduce((a, c) => a + c, 0),
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
