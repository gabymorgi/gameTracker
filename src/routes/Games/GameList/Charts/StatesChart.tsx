import { Pie } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import React, { useMemo } from 'react'
import { Card } from 'antd'
import { GameState } from '@/ts/api/games'
import { stateTemplates } from '@/utils/color'
import { NoData } from '@/components/ui/NoData'

const GameStateOptions: (games: number) => ChartOptions<'pie'> = (games) => ({
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    title: {
      display: true,
      text: `Games State (${games})`,
      color: '#EEE',
      font: {
        size: 24,
      },
    },
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 14,
        },
      },
    },
  },
})

interface Props {
  data?: Array<{
    state: GameState
    count: number
  }>
}

export const StatesChart: React.FC<Props> = (props) => {
  const dataChart = useMemo(() => {
    const labels = props.data?.map((d) => d.state)
    const values = props.data?.map((d) => d.count)
    const bgColor = labels?.map(
      (l) => `hsl(${stateTemplates[l] || 0}, 100%, 10%)`,
    )
    const borderColor = labels?.map(
      (l) => `hsl(${stateTemplates[l] || 0}, 100%, 40%)`,
    )
    const total = values?.reduce((acc, curr) => acc + curr, 0)
    return {
      labels,
      values,
      bgColor,
      borderColor,
      total,
    }
  }, [props.data])
  return (
    <Card>
      {props.data?.length ? (
        <Pie
          data={{
            labels: dataChart?.labels,
            datasets: [
              {
                data: dataChart.values,
                backgroundColor: dataChart.bgColor,
                borderColor: dataChart.borderColor,
                borderWidth: 3,
              },
            ],
          }}
          options={GameStateOptions(dataChart.total || 0)}
        />
      ) : (
        <NoData />
      )}
    </Card>
  )
}
