import { $Enums } from '#prisma-generated-client'
import { Select, SelectProps } from 'antd'

export function InputState(props: SelectProps<$Enums.GameState>) {
  return (
    <Select
      {...props}
      options={Object.keys($Enums.GameState).map((key) => ({
        value: key,
        label: key,
      }))}
    />
  )
}
