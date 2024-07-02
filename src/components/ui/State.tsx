import { useContext } from 'react'
import { GlobalContext } from '@/contexts/GlobalContext'
import { Tag } from './Tags'

export const State: React.FC<{ state?: string }> = (props) => {
  const { states: stateTemplates } = useContext(GlobalContext)
  return (
    <Tag
      size="middle"
      justify="center"
      $hue={stateTemplates?.[props.state || '']}
    >
      {props.state ?? 'State not found'}
    </Tag>
  )
}
