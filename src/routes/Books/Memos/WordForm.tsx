import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { AutoComplete } from 'antd'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import EditingCard from '../Training/EditingCard'
import { DefaultOptionType } from 'antd/es/select'

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

  const debouncedFetch = useDebouncedCallback(async (search: string) => {
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

  const handleSelect = async (value: string) => {
    const response = await query<FullMemo[]>(`memos/words/find/${value}`)
    const parsed: Memo = {
      ...response[0],
      word: response[0].value,
      phrases: response[0].wordPhrases.map((p) => p.phrase),
    }
    setData(parsed)
  }

  const handleClose = () => {
    setData(undefined)
    setRandomKey(randomKey + 1)
  }

  return (
    <div className="flex flex-col gap-16">
      <AutoComplete
        options={options}
        onSearch={debouncedFetch}
        onSelect={handleSelect}
        placeholder="Search game"
      />
      <EditingCard
        key={data?.id || randomKey}
        memo={
          data ||
          ({
            phrases: [] as Memo['phrases'],
          } as Memo)
        }
        handleClose={handleClose}
        handleEdit={handleClose}
      />
    </div>
  )
}

export default WordList
