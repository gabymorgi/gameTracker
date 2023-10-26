import { Pie } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import React, { useContext, useMemo } from 'react'
import { Card } from 'antd'
import { NoData } from './NoData'
import { GlobalContext } from '@/contexts/GlobalContext'

const GameTagsOptions: ChartOptions<'pie'> = {
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    title: {
      display: true,
      text: 'Most Played Tags',
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
}

interface Props {
  data?: Array<{
    tagId: string
    total_hours: number
  }>
}

export const TagsChart: React.FC<Props> = (props) => {
  const { tags: tagsTemplates } = useContext(GlobalContext)
  const dataChart = useMemo(() => {
    const labels = props.data?.map((d) => d.tagId)
    const values = props.data?.map((d) => d.total_hours / 60)
    const borderColor = labels?.map(
      (l) => `hsl(${tagsTemplates?.[l] || 0}, 100%, 70%)`,
    )
    const bgColor = labels?.map(
      (l) => `hsl(${tagsTemplates?.[l] || 0}, 100%, 15%)`,
    )
    return {
      labels,
      values,
      bgColor,
      borderColor,
    }
  }, [props.data, tagsTemplates])
  return (
    <Card>
      {props.data ? (
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
          options={GameTagsOptions}
        />
      ) : (
        <NoData />
      )}
    </Card>
  )
}
