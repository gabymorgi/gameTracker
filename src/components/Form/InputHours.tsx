import { InputNumber, SliderSingleProps } from 'antd'
import { useEffect, useState } from 'react'

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
    <div className="flex items-center">
      <InputNumber
        value={Math.floor(value / 60)}
        onChange={handleChangeHours}
      />
      :
      <InputNumber value={value % 60} onChange={handleChangeMinutes} />
    </div>
  )
}
