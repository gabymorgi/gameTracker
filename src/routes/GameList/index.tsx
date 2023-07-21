import { ChartComponent } from './Chart'
import { Filters } from './Filters'
import { FlexSection } from '@/components/ui/Layout'
import { Layout } from 'antd'
import GameTable from './GameTable'
import { Content } from 'antd/es/layout/layout'

const Index = () => {
  return (
    <Layout>
      <Content className='content'>
        <FlexSection direction='column'>
          <ChartComponent />
          <Filters />
          <GameTable />
        </FlexSection>
      </Content>
    </Layout>
  )
}

export default Index
