import { InputNumber, SliderSingleProps } from 'antd'
import { useEffect, useState } from 'react'
import { JoinedInput } from './JoinedInput'

export function InputHours(props: SliderSingleProps) {
  const [value, setValue] = useState(props.value || 0)

  useEffect(() => {
    setValue(props.value || 0)
  }, [props.value])

  const handleChangeHours = (hours: number | null) => {
    let newValue = (hours || 0) * 60 + (value % 60)
    if (newValue < 0) newValue = 0
    setValue(newValue)
    props.onChange?.(newValue)
  }

  const handleChangeMinutes = (minutes: number | null) => {
    let newValue = (minutes || 0) + Math.floor(value / 60) * 60
    if (newValue < 0) newValue = 0
    setValue(newValue)
    props.onChange?.(newValue)
  }

  return (
    <JoinedInput>
      <InputNumber
        className="w-full input-left"
        value={Math.floor(value / 60)}
        onChange={handleChangeHours}
      />
      <span className="divider">:</span>
      <InputNumber
        className="w-full input-right"
        value={value % 60}
        onChange={handleChangeMinutes}
      />
    </JoinedInput>
  )
}
