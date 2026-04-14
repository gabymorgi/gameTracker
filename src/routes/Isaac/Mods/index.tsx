import { ModFilters } from '@/components/Filters/IsaacFilters'
import { Flex } from 'antd'
import IsaacMods from './Mods'

const Index = () => {
  return (
    <Flex gap="small" vertical>
      <ModFilters />
      <IsaacMods />
    </Flex>
  )
}

export default Index
