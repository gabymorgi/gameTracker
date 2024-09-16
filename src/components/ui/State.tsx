import { GameState } from '@/ts/api/games'
import { Tag } from './Tags'
import { stateTemplates } from '@/utils/color'

export const State: React.FC<{ state: GameState }> = (props) => {
  return (
    <Tag size="middle" justify="center" $hue={stateTemplates[props.state]}>
      {props.state ?? 'State not found'}
    </Tag>
  )
}
