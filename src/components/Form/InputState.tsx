import { GameState, gameState } from '@/ts/api/games'
import { Select, SelectProps } from 'antd'

export function InputState(props: SelectProps<GameState>) {
  return (
    <Select
      {...props}
      options={Object.keys(gameState).map((key) => ({
        value: key,
        label: key,
      }))}
    />
  )
}
