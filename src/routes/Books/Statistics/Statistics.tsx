import { query } from '@/hooks/useFetch'
import { NoData } from '@/routes/Games/GameList/Charts/NoData'
import { ApiMemoStatistics } from '@/ts/api'
import { Spin } from 'antd'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { format, parse } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
)

const labels = ['0-25%', '25-50%', '50-75%', '75-100%']
const colors = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
]

const HoursPlayedOptions = {
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Words Learnt`,
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
}

const InProgresOptions = {
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'In progress',
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
}

function Statistics() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ApiMemoStatistics>()

  useEffect(() => {
    async function fetchData() {
      const res = await query('words/statistics')
      setData(res)
      setLoading(false)
    }
    fetchData()
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
    }
  }, [data])

  const InProgressChart = useMemo(() => {
    if (!data) return
    const keys = Object.keys(data.inProgress)
    const datasets = [0, 1, 2, 3].map((i) => ({
      label: labels[i],
      data: keys.map((k) => data.inProgress[Number(k)][i]),
      backgroundColor: colors[i],
    }))
    return {
      labels: keys,
      datasets,
    }
  }, [data])

  return (
    <Spin spinning={loading}>
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
            options={HoursPlayedOptions}
          />
        ) : (
          <NoData />
        )}
      </div>
      <div style={{ height: '40vh', minHeight: '400px', width: '100%' }}>
        {InProgressChart ? (
          <Bar options={InProgresOptions} data={InProgressChart} />
        ) : (
          <NoData />
        )}
      </div>
    </Spin>
  )
}

export default Statistics
