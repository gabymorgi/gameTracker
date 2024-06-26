import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { AutoComplete } from 'antd'
import { useState } from 'react'
import EditingCard from '../Train/EditingCard'
import { DefaultOptionType } from 'antd/es/select'
import { useDebounceCallback } from 'usehooks-ts'
import { apiToMemo } from '@/utils/format'

interface WordList {
  id: string
  value: string
}

function WordList() {
  const [options, setOptions] = useState<DefaultOptionType[]>([])
  const [data, setData] = useState<Memo>()
  const [randomKey, setRandomKey] = useState(0)

  const debouncedFetch = useDebounceCallback(async (search: string) => {
    const response = await query('words/search', {
      value: search,
    })

    setOptions(
      response.map((item) => ({
        value: item.id,
        label: item.value,
      })),
    )
  }, 500)

  const handleSelect = async (id: string) => {
    const response = await query(`words/find`, { id })
    setData(apiToMemo(response))
  }

  const handleClose = () => {
    setData(undefined)
    setRandomKey(randomKey + 1)
  }

  const handleDelete = async () => {
    if (!data) return
    setData(undefined)
    await query(`words/delete`, { id: data.id })
    setRandomKey(randomKey + 1)
  }

  return (
    <div className="flex flex-col gap-16">
      <AutoComplete
        options={options}
        onSearch={debouncedFetch}
        onSelect={handleSelect}
        placeholder="Search word"
      />
      <EditingCard
        key={data?.id || randomKey}
        memo={
          data ||
          ({
            phrases: [] as Memo['phrases'],
          } as Memo)
        }
        handleDelete={handleDelete}
        handleClose={handleClose}
        handleEdit={handleClose}
      />
    </div>
  )
}

export default WordList
