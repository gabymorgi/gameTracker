import { ChartComponent } from './Chart'
import { Flex } from 'antd'
import GameTable from './GameTable'
import { ChangelogFilters } from '@/components/Filters/ChangelogFilters'

const Index = () => {
  return (
    <Flex vertical gap="middle">
      <ChartComponent />
      <ChangelogFilters />
      <GameTable />
    </Flex>
  )
}

export default Index
