import { Line } from 'react-chartjs-2'
import { useMemo } from 'react'
import React from 'react'
import { Card } from 'antd'
import { format, getDaysInMonth, parse } from 'date-fns'
import { NoData } from '@/components/ui/NoData'

const HoursPlayedOptions = {
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Hours Played`,
      color: '#EEE',
      font: {
        size: 24,
      },
    },
  },
  scales: {
    y: {
      min: 0,
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

interface Props {
  data?: Array<{
    month_year: string
    achievements: number
    hours: number
  }>
}

export const HoursChart: React.FC<Props> = (props) => {
  const dataChart = useMemo(() => {
    const labels = (props.data ?? []).map((d) =>
      format(parse(d.month_year, 'yyyy-MM', new Date()), 'MMM yy'),
    )
    const values = (props.data ?? []).map((d) => d.hours / 60)

    const now = new Date()
    const currentMonthKey = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1,
    ).padStart(2, '0')}`
    const currentMonthIndex = props.data?.findIndex(
      (d) => d.month_year === currentMonthKey,
    )

    const estimatedSegment: Array<number | null> = values.map(() => null)

    if (
      typeof currentMonthIndex === 'number' &&
      currentMonthIndex > 0 &&
      values[currentMonthIndex] !== undefined &&
      values[currentMonthIndex - 1] !== undefined
    ) {
      const daysInMonth = getDaysInMonth(now)
      const dayOfMonth = now.getDate()
      const currentMonthPlayed = values[currentMonthIndex]
      const projectedCurrentMonth =
        dayOfMonth > 0 ? (currentMonthPlayed / dayOfMonth) * daysInMonth : 0

      estimatedSegment[currentMonthIndex - 1] = values[currentMonthIndex - 1]
      estimatedSegment[currentMonthIndex] = projectedCurrentMonth
    }

    return {
      labels,
      values,
      estimatedSegment,
    }
  }, [props.data])

  return (
    <Card>
      {props.data?.length ? (
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
              {
                data: dataChart.estimatedSegment,
                fill: false,
                borderColor: '#FFD166',
                borderDash: [6, 6],
                tension: 0,
                pointRadius: 3,
                pointBackgroundColor: '#FFD166',
              },
            ],
          }}
          options={HoursPlayedOptions}
        />
      ) : (
        <NoData />
      )}
    </Card>
  )
}
