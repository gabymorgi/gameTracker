import { Line, Pie } from 'react-chartjs-2'
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
  ChartOptions,
} from 'chart.js'
import { useMemo, useState } from 'react'
import {
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  format,
  getYear,
  startOfYear,
  subYears,
} from 'date-fns'
import { FlexSection } from '@/components/ui/Layout'
import Spin from '@/components/ui/Spin'
import { mdiDatabaseOff } from '@mdi/js'
import Icon from '@mdi/react'
import React from 'react'
import { Card, Col, Row } from 'antd'
import styled from 'styled-components'
import { dateToNumber, numberToDate } from '@/utils/format'
import { RangePicker } from '@/components/ui/DatePicker'
import { RangeValue } from 'rc-picker/lib/interface'
import { AggregateI, GenericObject } from '@/ts'
import { useFetch } from '@/hooks/useFetch'

type GenericTag = { [key: string]: number }

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const MIN_DATE = new Date(2015, 0, 1)
const MAX_DATE = endOfMonth(new Date())
const MIN_DATE_NUMBER = dateToNumber(MIN_DATE)
const MAX_DATE_NUMBER = dateToNumber(MAX_DATE)

//disable future dates in datepicker
//disable dates before 2015
//disable wrong dates (end date before start date)
const disabledDate = (current: number) => {
  return current > MAX_DATE_NUMBER || current < MIN_DATE_NUMBER
}

const rangePresets: {
  label: string
  value: [number, number]
}[] = [
  {
    label: 'All',
    value: [MIN_DATE_NUMBER, MAX_DATE_NUMBER],
  },
  {
    label: 'Last Year',
    value: [dateToNumber(subYears(MAX_DATE, 1)), MAX_DATE_NUMBER],
  },
  ...(eachYearOfInterval({
    start: MIN_DATE,
    end: MAX_DATE,
  }).map((year) => ({
    label: getYear(year).toString(),
    value: [dateToNumber(startOfYear(year)), dateToNumber(endOfYear(year))] as [
      number,
      number
    ],
  }))).reverse(),
]

const defaultPickerValue: [number, number] = [
  dateToNumber(subYears(MAX_DATE, 1)),
  MAX_DATE_NUMBER,
]

const defaultRangeFilter: GenericObject = {
  startDate: defaultPickerValue[0],
  endDate: defaultPickerValue[1],
}

const ChartContainer = styled.div`
  .ant-col.chart {
    &.line {
      height: 30vh;
    }
    &.game,
    &.tag {
      height: 50vh;
    }
    > .ant-card {
      height: 100%;

      .ant-card-body {
        height: 100%;
        width: 100%;
      }
    }
  }
`

const noData = (
  <div
    style={{
      display: 'flex',
      fontSize: '36px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <span>No data</span>
    <Icon path={mdiDatabaseOff} size={3} color='white' />
  </div>
)

const HoursPlayedOptions = (hours: number) => ({
  maintainAspectRatio: false,
  color: '#FFF',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Hours Played (${hours})`,
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

export const ChartComponent: React.FC = () => {
  const [rangeFilterValue, setRangeFilterValue] = useState<GenericObject>(defaultRangeFilter)
  const { data, loading } = useFetch<AggregateI[]>("games/aggregate", rangeFilterValue)

  const handleRangeChange = (value: RangeValue<number>) => {
    if (!value) return
    setRangeFilterValue({
      startDate: value[0],
      endDate: value[1],
    })
  }

  const dataCharts = useMemo(() => {
    if (!data?.length) return {}
    const tags: { [key: string]: number } = {}
    const states: { [key: string]: number } = {}
    const tagsData: GenericTag = {}
    const stateData: GenericTag = {
      Banned: 0,
      Dropped: 0,
      Playing: 0,
      Won: 0,
      Completed: 0,
      Achievements: 0,
    }
    let gamesCount = 0
    data.forEach((interval) => {
      Object.entries(interval.states).forEach(([key, value]) => {
        stateData[key] += value
        gamesCount += value
      })
      Object.entries(interval.tags).forEach(([key, value]) => {
        tagsData[key] = tagsData[key] ? tagsData[key] + value : value
      })
    })

    const dataIntervals = data.map((interval) => {
      return {
        label: format(numberToDate(interval.month), 'yyyy MMM'),
        hours: Math.round(interval.hours / 60),
      }
    })

    const tagsFilteredData = Object.entries(tagsData)
      .sort(([, value1], [, value2]) => value2 - value1)
      .slice(0, 6)
      .map(([key, value]) => [key, (value / 60).toFixed(1)])

    return {
      gamesCount: gamesCount,
      hoursCount: Math.round(dataIntervals.reduce((acum, g) => acum + (g.hours || 0), 0)),
      hourChart: {
        labels: dataIntervals.map((di) => di.label),
        values: dataIntervals.map((di) => Math.round(di.hours || 0)),
      },
      tagChart: {
        labels: tagsFilteredData.map(([key]) => key),
        values: tagsFilteredData.map(([, value]) => value),
        borderColor: tagsFilteredData.map(
          ([key]) => `hsl(${tags?.[key] || 0}, 100%, 70%)`
        ),
        bgColor: tagsFilteredData.map(([key]) => `hsl(${tags?.[key] || 0}, 100%, 15%)`),
      },
      stateChart: {
        labels: Object.keys(stateData),
        values: Object.values(stateData),
        borderColor: Object.keys(stateData).map(
          (key) => `hsl(${states?.[key] || 0}, 100%, 70%)`
        ),
        bgColor: Object.keys(stateData).map(
          (key) => `hsl(${states?.[key] || 0}, 100%, 15%)`
        ),
      },
    }
  }, [data])

  return (
    <FlexSection direction='column'>
      <ChartContainer>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <RangePicker
              picker='month'
              disabledDate={disabledDate}
              presets={rangePresets}
              defaultValue={defaultPickerValue}
              onChange={handleRangeChange}
            />
          </Col>
          <Col span={24} className='line chart'>
            <Card>
              {!loading && dataCharts.hourChart ? (
                dataCharts.gamesCount > 0 ? (
                  <Line
                    datasetIdKey='id'
                    data={{
                      labels: dataCharts.hourChart.labels,
                      datasets: [
                        {
                          data: dataCharts.hourChart.values,
                          fill: true,
                          borderColor: '#8F8',
                          cubicInterpolationMode: 'monotone',
                        },
                      ],
                    }}
                    //change grid color to blue
                    options={HoursPlayedOptions(Math.round(dataCharts.hoursCount || 0))}
                  />
                ) : (
                  noData
                )
              ) : (
                <Spin spinning size='large' />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12} className='game chart'>
            <Card>
              {!loading && dataCharts.stateChart ? (
                dataCharts.gamesCount > 0 ? (
                  <Pie
                    data={{
                      labels: dataCharts.stateChart?.labels,
                      datasets: [
                        {
                          data: dataCharts.stateChart.values,
                          backgroundColor: dataCharts.stateChart.bgColor,
                          borderColor: dataCharts.stateChart.borderColor,
                          borderWidth: 3,
                        },
                      ],
                    }}
                    options={GameStateOptions(dataCharts.gamesCount || 0)}
                  />
                ) : (
                  noData
                )
              ) : (
                <Spin spinning size='large' />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12} className='tag chart'>
            <Card>
              {!loading && dataCharts.tagChart ? (
                dataCharts.gamesCount > 0 ? (
                  <Pie
                    data={{
                      labels: dataCharts.tagChart?.labels,
                      datasets: [
                        {
                          data: dataCharts.tagChart.values,
                          backgroundColor: dataCharts.tagChart.bgColor,
                          borderColor: dataCharts.tagChart.borderColor,
                          borderWidth: 3,
                        },
                      ],
                    }}
                    options={GameTagsOptions}
                  />
                ) : (
                  noData
                )
              ) : (
                <Spin spinning size='large' />
              )}
            </Card>
          </Col>
        </Row>
      </ChartContainer>
    </FlexSection>
  )
}
