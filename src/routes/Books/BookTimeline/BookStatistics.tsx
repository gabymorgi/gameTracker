import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { useEffect, useMemo } from 'react'
import {
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  format,
  getYear,
  parse,
  startOfYear,
  subYears,
} from 'date-fns'
import Spin from '@/components/ui/Spin'
import { Card } from 'antd'
import styled from 'styled-components'
import DatePicker from '@/components/ui/DatePicker'
import { useQuery } from '@/hooks/useFetch'
import { Line } from 'react-chartjs-2'
import { NoData } from '@/components/ui/NoData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

function shortNumber(value: number): string {
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return value.toString()
}

const MIN_DATE = new Date(2023, 0, 1)
const MAX_DATE = endOfMonth(new Date())

const rangePresets: {
  label: string
  value: [Date, Date]
}[] = [
  {
    label: 'All',
    value: [MIN_DATE, MAX_DATE],
  },
  {
    label: 'Last Year',
    value: [subYears(MAX_DATE, 1), MAX_DATE],
  },
  ...eachYearOfInterval({
    start: MIN_DATE,
    end: MAX_DATE,
  })
    .map((year) => ({
      label: getYear(year).toString(),
      value: [startOfYear(year), endOfYear(year)] as [Date, Date],
    }))
    .reverse(),
]

const defaultPickerValue: [Date, Date] = [subYears(MAX_DATE, 1), MAX_DATE]

const defaultRangeFilter = {
  from: defaultPickerValue[0],
  to: defaultPickerValue[1],
}

const pagesOptions = (total: number) => ({
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Pages (${shortNumber(total)})`,
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
        callback: function (value: number | string) {
          return shortNumber(Number(value))
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

const StyledCard = styled(Card)`
  height: 30vh;
  min-height: 300px;

  .ant-card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
`

const StyledFloatingRangePicker = styled(DatePicker.RangePicker)`
  position: absolute;
  z-index: 1;
  width: 300px;
  top: 24px;
  right: 48px;

  @media (max-width: 992px) {
    right: 40px;
    width: 200px;
  }
`

export const BookStatistics: React.FC = () => {
  const { data, fetchData, loading } = useQuery('books/statistics')

  useEffect(() => {
    fetchData(defaultRangeFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRangeChange = (value: [Date | null, Date | null] | null) => {
    if (!value || !value[0] || !value[1]) return
    fetchData({
      from: value[0],
      to: value[1],
    })
  }

  const dataChart = useMemo(() => {
    const labels = data?.pages.map((d) =>
      format(parse(d.month_year, 'yyyy-MM', new Date()), 'MMM yy'),
    )
    const values = data?.pages.map((d) => d.amount)
    const total = data?.pages.reduce((acc, curr) => acc + curr.amount, 0)
    return {
      labels,
      values,
      total,
    }
  }, [data])

  return (
    <Spin
      spinning={loading}
      size="large"
      classNames={{
        container: 'w-full',
      }}
    >
      <StyledFloatingRangePicker
        picker="month"
        presets={rangePresets}
        defaultValue={defaultPickerValue}
        onChange={handleRangeChange}
      />
      <StyledCard className="line chart">
        {data?.pages?.length ? (
          <Line
            datasetIdKey="id"
            data={{
              labels: dataChart.labels,
              datasets: [
                {
                  data: dataChart.values,
                  fill: true,
                  borderColor: '#8F8',
                  cubicInterpolationMode: 'monotone',
                },
              ],
            }}
            options={pagesOptions(dataChart.total || 0)}
          />
        ) : (
          <NoData />
        )}
      </StyledCard>
    </Spin>
  )
}
