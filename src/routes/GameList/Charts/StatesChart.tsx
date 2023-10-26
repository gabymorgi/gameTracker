import { Pie } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import React, { useContext, useMemo } from 'react'
import { Card } from 'antd'
import { GlobalContext } from '@/contexts/GlobalContext'
import { NoData } from './NoData'

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
    stateId: string
    count: number
  }>
}

export const StatesChart: React.FC<Props> = (props) => {
  const { states: stateTemplates } = useContext(GlobalContext)
  const dataChart = useMemo(() => {
    const labels = props.data?.map((d) => d.stateId)
    const values = props.data?.map((d) => d.count)
    const bgColor = labels?.map(
      (l) => `hsl(${stateTemplates?.[l] || 0}, 100%, 15%)`,
    )
    const borderColor = labels?.map(
      (l) => `hsl(${stateTemplates?.[l] || 0}, 100%, 70%)`,
    )
    const total = values?.reduce((acc, curr) => acc + curr, 0)
    return {
      labels,
      values,
      bgColor,
      borderColor,
      total,
    }
  }, [props.data, stateTemplates])
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
