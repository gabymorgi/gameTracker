import { $SafeAny } from '@/ts'
import { NamePath } from 'antd/es/form/interface'

export const formatPlayedTime = (minutes: number) => {
  if (!minutes) return 'no data'
  const hours = Math.sign(minutes) * Math.floor(Math.abs(minutes) / 60)
  const minutesLeft = (Math.abs(minutes) % 60) * Math.sign(minutes)
  return `${hours}:${minutesLeft.toString().padStart(2, '0')}`
}

export const formattedDate = (date: Date) => {
  // 2024 Jan
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export const formattedPathName: (name?: NamePath) => Array<string | number> = (
  name,
) => {
  if (name === undefined) return []
  if (Array.isArray(name)) return name
  return [name]
}

export function formatQueryParams(queryParams: Record<string, $SafeAny>) {
  return Object.fromEntries(
    Object.entries(queryParams).filter(([, v]) => v != null && v !== ''),
  )
}
