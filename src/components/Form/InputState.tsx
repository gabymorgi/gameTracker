import { Select, SelectProps } from 'antd'
import { GameState } from '@/ts/api'

export function InputState(props: SelectProps<GameState>) {
  return (
    <Select {...props}>
      {Object.keys(GameState).map((key) => (
        <Select.Option key={key} value={key}>
          {key}
        </Select.Option>
      ))}
    </Select>
  )
}
