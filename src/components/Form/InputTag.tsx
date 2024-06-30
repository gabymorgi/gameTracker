import { Flex, InputNumber, Slider, SliderSingleProps } from 'antd'
import { useState } from 'react'
import { Tag } from '@/components/ui/Tags'

export function InputTag(props: SliderSingleProps) {
  const [value, setValue] = useState(props.value || 0)

  const handleChange = (value: number | null) => {
    setValue(value || 0)
    props.onChange?.(value || 0)
  }

  return (
    <Flex gap="middle" align="center">
      <Slider
        {...props}
        className="flex-grow"
        min={0}
        max={300}
        onChange={handleChange}
      />
      <InputNumber value={value} onChange={handleChange} min={0} max={300} />
      <Tag $hue={value}>Tag Test</Tag>
    </Flex>
  )
}
