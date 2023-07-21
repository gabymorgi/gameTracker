import { NamePath } from "antd/es/form/interface"

export const formatPlayedTime = (minutes: number) => {
  if (!minutes) return '0h'
  const hours = Math.floor(minutes / 60)
  const minutesLeft = minutes % 60
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

export const formattedPathName: (name?: NamePath) => Array<string | number> = (name) => {
  if (name === undefined) return []
  if (Array.isArray(name)) return name
  return [name]
}

