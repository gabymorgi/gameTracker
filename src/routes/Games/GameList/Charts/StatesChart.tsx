import { Pie } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import React, { useMemo } from 'react'
import { Card } from 'antd'
import { NoData } from './NoData'
import { GameState } from '@/ts/api'

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

const stateTemplates = {
  [GameState.ACHIEVEMENTS]: 0,
  [GameState.BANNED]: 60,
  [GameState.COMPLETED]: 120,
  [GameState.DROPPED]: 180,
  [GameState.PLAYING]: 240,
  [GameState.WON]: 300,
}

export const StatesChart: React.FC<Props> = (props) => {
  const dataChart = useMemo(() => {
    const labels = props.data?.map((d) => d.state)
    const values = props.data?.map((d) => d.count)
    const bgColor = labels?.map(
      (l) => `hsl(${stateTemplates[l] || 0}, 100%, 15%)`,
    )
    const borderColor = labels?.map(
      (l) => `hsl(${stateTemplates[l] || 0}, 100%, 70%)`,
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
