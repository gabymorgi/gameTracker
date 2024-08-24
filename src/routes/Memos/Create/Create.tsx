import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { AutoComplete, Flex, Spin } from 'antd'
import { useState } from 'react'
import EditingCard from '../Train/EditingCard'
import { DefaultOptionType } from 'antd/es/select'
import { useDebounceCallback } from 'usehooks-ts'
import { apiToMemo } from '@/utils/format'
import { hsl, lab } from 'd3-color'

function findDivisions(values: number[], numSections: number): number[] {
  if (values.length < numSections) {
    throw new Error(
      'The number of values must be greater than or equal to the number of sections',
    )
  }
  if (values.length === numSections) {
    return Array.from({ length: numSections - 1 }, (_, i) => i + 1)
  }
  const totalSum = values.reduce((acc, val) => acc + val, 0)
  const targetSum = totalSum / numSections
  let currentSum = 0
  const divisions: number[] = []

  for (let i = 0; i < values.length; i++) {
    currentSum += values[i]

    if (currentSum > targetSum) {
      const dif1 = Math.abs(currentSum - targetSum)
      const dif2 = Math.abs(currentSum - values[i] - targetSum)
      if (dif1 > dif2) {
        divisions.push(i - 1)
        currentSum = values[i]
      } else {
        divisions.push(i)
        currentSum = 0
      }
    }

    if (divisions.length >= numSections - 1) break
  }

  return divisions
}

function colorDistance(color1: string, color2: string): number {
  // Convertir los colores HSL a objetos de color LAB usando d3-color
  const lab1 = lab(hsl(color1))
  const lab2 = lab(hsl(color2))

  // Calcular la distancia euclidiana entre los dos colores en el espacio LAB
  return Math.sqrt(
    Math.pow(lab2.l - lab1.l, 2) +
      Math.pow(lab2.a - lab1.a, 2) +
      Math.pow(lab2.b - lab1.b, 2),
  )
}
interface CreateMemo {
  id: string
  value: string
}

function CreateMemo() {
  const [options, setOptions] = useState<DefaultOptionType[]>([])
  const [data, setData] = useState<Memo>()
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
      const wordFrequency = await getWordFrequency()
      const priority = wordFrequency[value] || 0
      setData({ value: value, phrases: [], priority } as unknown as Memo)
    } else {
      setLoading(true)
      const response = await query(`words/find`, { id: option.title })
      setData(apiToMemo(response))
      setLoading(false)
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

  // Ejemplo de uso
  const res = [0, 36, 58, 92, 150, 175, 194, 211, 228, 281, 311, 334]
  let step = 1
  const el = []
  const el2 = []
  const distances = []

  for (let i = 0; i < res.length; i++) {
    el.push(
      <div
        title={`Hue ${i} - ${i + step}: ${res[i]}`}
        key={i}
        style={{
          backgroundColor: `hsl(${i * 30}, 100%, 50%)`,
          color: 'black',
          width: '30px',
          height: '20px',
        }}
      >
        {i * 30}
      </div>,
    )
  }

  for (let i = 0; i < res.length; i++) {
    el2.push(
      <div
        title={`Hue ${i} - ${i + step}: ${res[i]}`}
        key={i}
        style={{
          backgroundColor: `hsl(${res[i]}, 100%, 50%)`,
          color: 'black',
          width: '30px',
          height: '20px',
        }}
      >
        {res[i]}
      </div>,
    )
  }

  for (let i = 0; i < 360; i += step) {
    const distance = colorDistance(
      `hsl(${i}, 100%, 50%)`,
      `hsl(${i + step}, 100%, 50%)`,
    )
    distances.push(distance)
  }

  console.log(distances)
  console.log(findDivisions(distances, 12))

  return (
    <Flex vertical gap="middle">
      <Flex wrap>{el}</Flex>
      <Flex wrap>{el2}</Flex>
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
