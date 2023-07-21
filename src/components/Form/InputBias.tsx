import { InputNumberProps } from 'antd'
import { Bias } from '@/components/ui/Bias'
import { useEffect } from 'react'

export function InputBias(props: InputNumberProps) {
  useEffect(() => {
    if (props.value === undefined || props.value === null) {
      props.onChange?.(0)
    }
  }, [props.value])

  const handleChange = () => {
    if (props.value === 0) {
      props.onChange?.(1)
    } else if (props.value === 1) {
      props.onChange?.(-1)
    } else {
      props.onChange?.(0)
    }
  }

  return (
    <div onClick={handleChange} className='pointer'>
      <Bias value={Number(props.value || 0)} />
    </div>
  )
}
