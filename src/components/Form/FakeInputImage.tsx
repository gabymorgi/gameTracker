import { InputProps } from 'antd'
import Img from '@/components/ui/Img'

export function FakeInputImage(props: InputProps) {
  return (
    <Img
      width='100%'
      style={{ objectFit: 'cover' }}
      src={props.value?.toString() || ''}
      alt={`${props.value} header`}
      $errorComponent={<span className='font-16'>Error</span>}
    />
  )
}
