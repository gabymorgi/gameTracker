import { ChartComponent } from './Chart'
import { Filters } from './Filters'
import { Flex } from 'antd'
import GameTable from './GameTable'

const Index = () => {
  return (
    <Flex vertical gap="middle">
      <ChartComponent />
      <Filters />
      <GameTable />
    </Flex>
  )
}

export default Index
