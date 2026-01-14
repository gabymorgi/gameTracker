import { ChartComponent } from './Chart'
import { Flex } from 'antd'
import GameTable from './GameTable'
import { ChangelogFilters } from '@/components/Filters/ChangelogFilters'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

const Index = () => {
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <Flex vertical gap="middle">
      {isAuthenticated ? <ChartComponent /> : undefined}
      <ChangelogFilters />
      <GameTable />
    </Flex>
  )
}

export default Index
