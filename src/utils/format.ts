import { NamePath } from 'antd/es/form/interface'

export const formatPlayedTime = (minutes: number) => {
  if (!minutes) return '0h'
  const hours = Math.sign(minutes) * Math.floor(Math.abs(minutes) / 60)
  const minutesLeft = (Math.abs(minutes) % 60) * Math.sign(minutes)
  return hours ? `${hours}h ${minutesLeft}m` : `${minutesLeft}m`
}

export const dateToNumber = (date: Date) => {
  return Math.round(date.getTime() / 1000)
}

export const numberToDate = (number: number) => {
  return new Date(number * 1000)
}

export const formattedDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const formattedPathName: (name?: NamePath) => Array<string | number> = (
  name,
) => {
  if (name === undefined) return []
  if (Array.isArray(name)) return name
  return [name]
}

export const markdownToJSON = (markdown: string) => {
  /// string between three backticks and json
  try {
    const regex = /```json([\s\S]*?)```/g
    const match = regex.exec(markdown)
    if (!match) return null
    const json = match[1]
    return JSON.parse(json)
  } catch (error) {
    console.log('error', error)
    return null
  }
}
