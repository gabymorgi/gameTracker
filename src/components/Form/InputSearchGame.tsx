import { useEffect, useRef, useState } from 'react'
import { AutoComplete, AutoCompleteProps, Flex, Input } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { query } from '@/hooks/useFetch'
import { useDebounceCallback } from 'usehooks-ts'
import styled from 'styled-components'
import { message } from '@/contexts/GlobalContext'

const StyledAutoComplete = styled(AutoComplete)`
  min-width: 200px;
` as typeof AutoComplete

const InputSearchGame: React.FC = (props: AutoCompleteProps) => {
  const currValue = useRef<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const [options, setOptions] = useState<DefaultOptionType[]>([])

  async function updateValue(id: string) {
    setLoading(true)
    try {
      const response = await query('games/search', {
        id,
      })

      setValue(response[0].name)
      setOptions([
        {
          value: response[0].name,
          label: (
            <Flex gap="middle" align="center">
              <img
                src={response[0].imageUrl}
                alt={response[0].name}
                height={32}
                width={68}
              />
              <span>{response[0].name}</span>
            </Flex>
          ),
          title: response[0].id,
        },
      ])
    } catch (error) {
      message.error('Game not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currValue.current === props.value) return
    currValue.current = props.value
    updateValue(props.value)
  }, [props.value])

  const debouncedFetch = useDebounceCallback(async (search: string) => {
    const response = await query('games/search', {
      search,
    })

    setOptions(
      response.map((item) => ({
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
      })),
    )
  }, 500)

  const handleSelect = async (_value: string, option: DefaultOptionType) => {
    props.onChange?.(option.title, option)
    currValue.current = option.title
  }

  const { value: propValue, onChange, ...restProps } = props

  return (
    <StyledAutoComplete
      {...restProps}
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
