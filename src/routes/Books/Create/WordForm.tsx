import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { AutoComplete } from 'antd'
import { useState } from 'react'
import EditingCard from '../Train/EditingCard'
import { DefaultOptionType } from 'antd/es/select'
import { useDebounceCallback } from 'usehooks-ts'

interface FullMemo extends Exclude<Memo, 'phrases' | 'word'> {
  wordPhrases: {
    phrase: Memo['phrases'][number]
  }[]
  value: string
}

interface WordList {
  id: string
  value: string
}

function WordList() {
  const [options, setOptions] = useState<DefaultOptionType[]>([])
  const [data, setData] = useState<Memo>()
  const [randomKey, setRandomKey] = useState(0)

  const debouncedFetch = useDebounceCallback(async (search: string) => {
    const response = await query<WordList[]>('memos/words/search', 'GET', {
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
    const response = await query<FullMemo>(`memos/words/find/${id}`)
    const parsed: Memo = {
      ...response,
      word: response.value,
      phrases: response.wordPhrases.map((p) => p.phrase),
    }
    setData(parsed)
  }

  const handleClose = () => {
    setData(undefined)
    setRandomKey(randomKey + 1)
  }

  const handleDelete = async () => {
    if (!data) return
    setData(undefined)
    await query(`memos/words/delete/${data.id}`, 'DELETE')
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
