import { ChartComponent } from './Chart'
import { Filters } from './Filters'
import { Layout } from 'antd'
import GameTable from './GameTable'
import { Content } from 'antd/es/layout/layout'
import { Options, query, useFetch } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import data from './c.json'
import parsed from './m.json'
import { isSameMonth } from 'date-fns'

interface Data {
  achievements: number
  createdAt: number
  hours: number
  gameId: string
  id: string
  stateId: string
  action?: string
}

const Index = () => {
  return (
    <Layout>
      <Content className='content'>
        <div className='flex flex-col gap-16'>
          <ChartComponent />
          <Filters />
          <GameTable />
        </div>
      </Content>
    </Layout>
  )
}

export default Index
