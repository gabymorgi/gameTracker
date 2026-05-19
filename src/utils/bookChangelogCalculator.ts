import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfMonth,
} from 'date-fns'
import { BookChangelog } from '@/ts/api/changelogs'

interface CalculateBookChangelogsInput {
  start: Date
  end: Date
  words: number
  idPrefix?: string
}

export function calculateBookChangelogs({
  start,
  end,
  words,
  idPrefix = 'calculated',
}: CalculateBookChangelogsInput): BookChangelog[] {
  const everyDay = eachDayOfInterval({
    start,
    end,
  })
  let wordsRemaining = words
  const wordsPerDay = Math.round(words / everyDay.length)
  const wordsPerMonth: Record<string, number> = {}

  everyDay.forEach((date) => {
    const month = format(date, 'yyyy-MM')
    wordsPerMonth[month] = wordsPerMonth[month]
      ? wordsPerMonth[month] + wordsPerDay
      : wordsPerDay
    wordsRemaining -= wordsPerDay
  })

  if (wordsRemaining) {
    const lastDay = everyDay[everyDay.length - 1]
    const lastMonth = format(lastDay, 'yyyy-MM')
    wordsPerMonth[lastMonth] += wordsRemaining
  }

  return Object.entries(wordsPerMonth).map(([month, monthWords], index) => ({
    id: `${idPrefix}-${month}-${index}-${Date.now()}`,
    createdAt: startOfMonth(parse(month, 'yyyy-MM', new Date())),
    words: monthWords,
  }))
}

export function calculateBookChangelogsByMonthRange(
  from: Date,
  to: Date,
  amount: number,
  idPrefix?: string,
) {
  return calculateBookChangelogs({
    start: startOfMonth(from),
    end: endOfMonth(to),
    words: amount,
    idPrefix,
  })
}
