import { GlobalContext } from '@/contexts/GlobalContext'
import { Select, SelectProps } from 'antd'
import { useContext } from 'react'

export function InputTags(props: SelectProps<string[]>) {
  const { tags } = useContext(GlobalContext)

  return (
    <Select
      {...props}
      mode="tags"
      options={
        tags
          ? Object.keys(tags)
              .sort()
              .map((key) => ({ value: key, label: key }))
          : []
      }
    />
  )
}
