import { useState } from 'react'
import { AutoComplete, AutoCompleteProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { query } from '@/hooks/useFetch'
import { useDebounceCallback } from 'usehooks-ts'

const InputSearchGame: React.FC = (props: AutoCompleteProps) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([])

  const debouncedFetch = useDebounceCallback(async (search: string) => {
    const response = await query('games/search', {
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

  return (
    <AutoComplete
      {...props}
      options={options}
      onSearch={debouncedFetch}
      placeholder="Search game"
    />
  )
}

export default InputSearchGame
