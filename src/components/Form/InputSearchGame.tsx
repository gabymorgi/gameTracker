import { useEffect, useMemo, useRef, useState } from 'react'
import { AutoComplete, AutoCompleteProps, Flex, Input } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { useQuery } from '@/hooks/useFetch'
import { useDebounceCallback } from 'usehooks-ts'
import styled from 'styled-components'

const StyledAutoComplete = styled(AutoComplete)`
  min-width: 200px;
` as typeof AutoComplete

const InputSearchGame: React.FC = (props: AutoCompleteProps) => {
  const currValue = useRef<string>()
  const [value, setValue] = useState<string>('')
  const { data, fetchData, loading } = useQuery('games/search')

  const options: DefaultOptionType[] = useMemo(() => {
    if (!data) return []
    return data.map((item) => ({
      // id is set on title, because it's not used in the component
      // value is set when select
      // label is used to display the dropdown options
      value: item.name,
      label: (
        <Flex gap="middle" align="center">
          <img src={item.imageUrl} alt={item.name} height={32} width={68} />
          <span>{item.name}</span>
        </Flex>
      ),
      title: item.id,
    }))
  }, [data])

  useEffect(() => {
    if (currValue.current === props.value) return
    currValue.current = props.value
    setValue(data?.find((item) => item.id === props.value)?.name || props.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (currValue.current === props.value) return
    fetchData({
      id: props.value,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  const debouncedFetch = useDebounceCallback((search: string) => {
    fetchData({
      search,
    })
  }, 500)

  const handleSelect = async (_value: string, option: DefaultOptionType) => {
    props.onChange?.(option.title, option)
    currValue.current = option.title
  }

  return (
    <StyledAutoComplete
      {...props}
      value={value}
      onChange={(value) => setValue(value)}
      options={options}
      onSearch={debouncedFetch}
      onSelect={handleSelect}
    >
      <Input.Search placeholder="Search game" loading={loading} />
    </StyledAutoComplete>
  )
}

export default InputSearchGame
