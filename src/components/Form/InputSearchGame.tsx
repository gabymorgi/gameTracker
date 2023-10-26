import { useState } from 'react'
import { AutoComplete, AutoCompleteProps } from 'antd'
import { useDebouncedCallback } from 'use-debounce'
import { DefaultOptionType } from 'antd/es/select'
import { query, Options } from '@/hooks/useFetch'
import { EndPoint, GameI } from '@/ts'

const InputSearchGame: React.FC = (props: AutoCompleteProps) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([])

  const debouncedFetch = useDebouncedCallback(async (search: string) => {
    const response = await query<GameI[]>(EndPoint.GAME_SEARCH, Options.GET, {
      search,
    })

    setOptions(
      response.map((item) => ({
        value: item.id,
        label: (
          <div className="flex gap-16 items-center no-shrink">
            <img src={item.imageUrl} alt={item.name} height={32} width={68} />
            <span>{item.name}</span>
          </div>
        ),
      })),
    )
  }, 500)

  const onChange = (data: string) => {
    debouncedFetch(data)
  }

  return (
    <AutoComplete
      {...props}
      options={options}
      onSearch={onChange}
      placeholder="Search game"
    />
  )
}

export default InputSearchGame
