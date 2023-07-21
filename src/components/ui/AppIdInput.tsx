import { Input, InputProps } from 'antd'
import { useEffect, useState } from 'react'

export function InputImg(props: InputProps) {
  const [value, setValue] = useState(props.value || 0)

  useEffect(() => {
    setValue(props.value || 0)
  }, [props.value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  return (
    <div className='flex items-center gap-16'>
      <Input {...props} value={value} onChange={handleChange} />
      <img src={value.toString()} alt='img' />
    </div>
  )
}
