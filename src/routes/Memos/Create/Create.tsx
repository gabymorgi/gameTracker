import { query } from '@/hooks/useFetch'
import { AutoComplete, Flex, Spin } from 'antd'
import { useState } from 'react'
import EditingCard from '../Train/EditingCard'
import { DefaultOptionType } from 'antd/es/select'
import { useDebounceCallback } from 'usehooks-ts'
import { Word } from '@/ts/api/words'

interface CreateMemo {
  id: string
  value: string
}

function CreateMemo() {
  const [options, setOptions] = useState<DefaultOptionType[]>([])
  const [data, setData] = useState<Word>()
  const [wordFrequency, setWordFrequency] = useState<Record<string, number>>()
  const [loading, setLoading] = useState(false)

  async function getWordFrequency() {
    if (wordFrequency) return wordFrequency
    setLoading(true)
    const response = await fetch('/words-frecuency.json')
    const data = await response.json()
    setWordFrequency(data)
    setLoading(false)
    return data
  }

  const debouncedFetch = useDebounceCallback(async (search: string) => {
    const response = await query('words/search', 'GET', {
      search,
    })
    console.log(response)

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
      const wordFrequency = await getWordFrequency()
      const priority = wordFrequency[value] || 0
      setData({ value: value, phrases: [], priority } as unknown as Word)
    } else {
      setLoading(true)
      const response = await query(`words/find`, 'POST', {
        id: option.title || '',
      })
      setData(response || undefined)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setData(undefined)
  }

  const handleDelete = async () => {
    if (!data) return
    setData(undefined)
    await query(`words/delete`, 'DELETE', { id: data.id })
  }

  return (
    <Flex vertical gap="middle">
      <Spin spinning={loading} fullscreen />
      <AutoComplete
        options={options}
        onSearch={debouncedFetch}
        onSelect={handleSelect}
        size="middle"
        placeholder="Search word"
      />
      {data && (
        <EditingCard
          key={data.id || data.value || 'new'}
          isNew={!data.id}
          memo={data}
          handleDelete={handleDelete}
          handleClose={handleClose}
          handleEdit={handleClose}
        />
      )}
    </Flex>
  )
}

export default CreateMemo
