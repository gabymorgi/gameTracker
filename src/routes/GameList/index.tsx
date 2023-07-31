import { ChartComponent } from './Chart'
import { Filters } from './Filters'
import { Layout } from 'antd'
import GameTable from './GameTable'
import { Content } from 'antd/es/layout/layout'

const Index = () => {
  return (
    <Layout>
      <Content className='content'>
        <div className='flex felx-col gap-16'>
          {/* <ChartComponent />
          <Filters /> */}
          <GameTable />
        </div>
      </Content>
    </Layout>
  )
}

export default Index
