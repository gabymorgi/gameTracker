import { Flex, Segmented } from 'antd'
import { useState } from 'react'
import ByGame from './ByGame/ByGame'
import Timeline from './Timeline/Timeline'

enum RadioOptions {
  ByGame = 'By Game',
  Timeline = 'Timeline',
}

const Changelogs = () => {
  const [value, setValue] = useState(RadioOptions.ByGame)

  return (
    <Flex vertical gap="middle">
      <Segmented
        options={Object.values(RadioOptions)}
        onChange={setValue}
        value={value}
      />
      {value === RadioOptions.ByGame ? <ByGame /> : <Timeline />}
    </Flex>
  )
}

export default Changelogs
