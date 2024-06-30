import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { AutoComplete, Flex } from 'antd'
import { useState } from 'react'
import EditingCard from '../Train/EditingCard'
import { DefaultOptionType } from 'antd/es/select'
import { useDebounceCallback } from 'usehooks-ts'
import { apiToMemo } from '@/utils/format'

interface WordForm {
  id: string
  value: string
}

function WordForm() {
  const [options, setOptions] = useState<DefaultOptionType[]>([])
  const [data, setData] = useState<Memo>()

  const debouncedFetch = useDebounceCallback(async (search: string) => {
    const response = await query('words/search', {
      value: search,
    })

    // id is set on title, because it's not used in the component
    // value is set when select
    // label is used to display the dropdown options
    const newOptions = response.map((item) => ({
      value: item.value,
      label: `${item.value} - ${item.id}`,
      title: item.id,
    }))

    if (!response.some((item) => item.value === search)) {
      newOptions.push({
        value: search,
        label: `Create "${search}"`,
        title: '__create__',
      })
    }

    setOptions(newOptions)
  }, 500)

  const handleSelect = async (value: string, option: DefaultOptionType) => {
    if (option.title === '__create__') {
      setData({ value: value, phrases: [], priority: 13 } as unknown as Memo)
    } else {
      const response = await query(`words/find`, { id: option.title })
      setData(apiToMemo(response))
    }
  }

  const handleClose = () => {
    setData(undefined)
  }

  const handleDelete = async () => {
    if (!data) return
    setData(undefined)
    await query(`words/delete`, { id: data.id })
  }

  return (
    <Flex vertical gap="middle">
      <AutoComplete
        options={options}
        onSearch={debouncedFetch}
        onSelect={handleSelect}
        size="middle"
        placeholder="Search word"
      />
      {data && (
        <EditingCard
          memo={data}
          handleDelete={handleDelete}
          handleClose={handleClose}
          handleEdit={handleClose}
        />
      )}
    </Flex>
  )
}

export default WordForm
