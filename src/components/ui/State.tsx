import { Tag } from './Tags'
import { GameState } from '@/ts/api'

const stateTemplates = {
  [GameState.ACHIEVEMENTS]: 0,
  [GameState.BANNED]: 60,
  [GameState.COMPLETED]: 120,
  [GameState.DROPPED]: 180,
  [GameState.PLAYING]: 240,
  [GameState.WON]: 300,
}

export const State: React.FC<{ state: GameState }> = (props) => {
  return (
    <Tag size="middle" justify="center" $hue={stateTemplates[props.state]}>
      {props.state ?? 'State not found'}
    </Tag>
  )
}
