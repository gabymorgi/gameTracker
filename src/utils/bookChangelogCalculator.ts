import { BookChangelog } from '#prisma-browser-client'
import { eachDayOfInterval, format } from 'date-fns'

interface CalculateBookChangelogsInput {
  start: Date
  end: Date
  pages: number
  idPrefix?: string
}

export function calculateBookChangelogs({
  start,
  end,
  pages,
  idPrefix = 'calculated',
}: CalculateBookChangelogsInput): Omit<BookChangelog, 'bookId'>[] {
  const everyDay = eachDayOfInterval({
    start,
    end,
  })
  const pagesPerDay = Math.floor(pages / everyDay.length)
  let remainingPages = pages % everyDay.length
  const pagesPerMonth: Record<string, number> = {}

  everyDay.forEach((date) => {
    const month = format(date, 'yyyy-MM')
    const dailyPages = pagesPerDay + (remainingPages > 0 ? 1 : 0)
    pagesPerMonth[month] = (pagesPerMonth[month] || 0) + dailyPages
    remainingPages = Math.max(remainingPages - 1, 0)
  })

  return Object.entries(pagesPerMonth).map(([month, monthPages], index) => {
    // Anchor monthly changelog timestamps at UTC noon to avoid timezone month drift.
    const [year, monthNumber] = month.split('-').map(Number)
    return {
      id: `${idPrefix}-${month}-${index}-${Date.now()}`,
      createdAt: new Date(Date.UTC(year, monthNumber - 1, 1, 12)),
      pages: monthPages,
    }
  })
}
