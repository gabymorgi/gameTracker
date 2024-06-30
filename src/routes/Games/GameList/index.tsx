import { ChartComponent } from './Chart'
import { Filters } from './Filters'
import { Flex, Layout } from 'antd'
import GameTable from './GameTable'
import { Content } from 'antd/es/layout/layout'

const Index = () => {
  return (
    <Layout>
      <Content className="content">
        <Flex vertical gap="middle">
          <ChartComponent />
          <Filters />
          <GameTable />
        </Flex>
      </Content>
    </Layout>
  )
}

export default Index
