import { Slider, SliderSingleProps } from 'antd'
import { useState } from 'react'
import { Tag } from '@/components/ui/Tags'

export function InputTag(props: SliderSingleProps) {
  const [value, setValue] = useState(props.value || 0)

  const handleChange = (value: number) => {
    setValue(value)
    props.onChange?.(value)
  }

  return (
    <div className='flex gap-16 items-center'>
      <Slider {...props} className="flex-grow" min={0} max={360} onChange={handleChange} />
      <Tag hue={value}>Tag Test</Tag>
    </div>
  )
}
