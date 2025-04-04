import { ModFilters } from '@/components/Filters/IsaacFilters'
import { Flex } from 'antd'
import ModStadistics from './ModStadistics'
import IsaacMods from './Mods'

const Index = () => {
  return (
    <Flex gap="small" vertical>
      <ModFilters />
      <ModStadistics />
      <IsaacMods />
    </Flex>
  )
}

export default Index
