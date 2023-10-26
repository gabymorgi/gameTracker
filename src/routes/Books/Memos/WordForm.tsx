import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
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

  const debouncedFetch = useDebouncedCallback(async (search: string) => {
    const response = await query<WordList[]>(
      EndPoint.WORDS_VALUES,
      Options.GET,
      {
        value: search,
      },
    )

    setOptions(
      response.map((item) => ({
        value: item.id,
        label: item.value,
      })),
    )
  }, 500)

  const handleSelect = async (value: string) => {
    const response = await query<FullMemo[]>(
      EndPoint.WORDS_VALUES,
      Options.GET,
      {
        id: value,
      },
    )
    const parsed: Memo = {
      ...response[0],
      word: response[0].value,
      phrases: response[0].wordPhrases.map((p) => p.phrase),
    }
    setData(parsed)
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
        key={data?.id || 'new'}
        memo={
          data ||
          ({
            phrases: [] as Memo['phrases'],
          } as Memo)
        }
        handleClose={() => setData(undefined)}
        handleEdit={() => {}}
      />
    </div>
  )
}

export default WordList
