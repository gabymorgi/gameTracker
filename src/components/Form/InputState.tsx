import { GameState, gameState } from '@/ts/api/games'
import { Select, SelectProps } from 'antd'

export function InputState(props: SelectProps<GameState>) {
  return (
    <Select {...props}>
      {Object.keys(gameState).map((key) => (
        <Select.Option key={key} value={key}>
          {key}
        </Select.Option>
      ))}
    </Select>
  )
}
