import { Select, SelectProps } from 'antd'
import { useContext } from 'react'
import { GlobalContext } from '@/contexts/GlobalContext'

export function InputState(props: SelectProps<string>) {
  const { states } = useContext(GlobalContext)

  return (
    <Select {...props}>
      {states &&
        Object.keys(states).map((key) => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
    </Select>
  )
}
