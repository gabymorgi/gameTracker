import { ChartComponent } from './Chart'
import { Flex } from 'antd'
import GameTable from './GameTable'
import { GameFilters } from '@/components/Filters/GameFilters'

const Index = () => {
  return (
    <Flex vertical gap="middle">
      <ChartComponent />
      <GameFilters />
      <GameTable />
    </Flex>
  )
}

export default Index
