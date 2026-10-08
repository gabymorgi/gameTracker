import { Card, Empty, Grid } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useOnInView } from 'react-intersection-observer'
import { usePaginatedFetch } from '@/hooks/useFetch'
import useBookFilters from '@/hooks/useBookFilters'
import { formattedDate } from '@/utils/format'
import { BookTimelineEntry, BooksTimelineGetParams } from '@/ts/api/books'
import ViewBookItem from './ViewBookItem'
import { SkeletonBookChangelogGroup } from '@/components/skeletons/SkeletonBookChangelog'

interface MonthGroup {
  key: string
  pages: number
  entries: BookTimelineEntry[]
  span: number
}

const MainGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
  gap: 16px;
`

const MonthGrid = styled.div<{ $span: number }>`
  display: grid;
  gap: 40px; // 16px main grid gap + 2 * 12px card padding
  grid-template-columns: repeat(${({ $span }) => $span}, minmax(0, 1fr));
`

function useColumns() {
  const bp = Grid.useBreakpoint()
  if (bp.xxl) return 6
  if (bp.xl) return 5
  if (bp.lg) return 4
  if (bp.md) return 3
  if (bp.sm) return 2
  return 1
}

function layoutGroups(groups: MonthGroup[], cols: number) {
  let used = 0
  groups.forEach((group, index) => {
    const need = Math.min(group.entries.length, cols)
    if (used > 0 && used + need > cols) {
      // The last card of a row grows to absorb leftover cells.
      groups[index - 1].span += cols - used
      used = 0
    }
    group.span = need
    used = (used + need) % cols
  })
}

const BookTable: React.FC = () => {
  const { queryParams } = useBookFilters()
  const cols = useColumns()
  const { data, nextPage, isMore, reset } = usePaginatedFetch({
    endpoints: { get: 'books/getTimeline' },
  })

  const inViewRef = useOnInView((inView) => {
    if (inView) {
      nextPage()
    }
  })

  useEffect(() => {
    reset(queryParams as BooksTimelineGetParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  const groups: MonthGroup[] = []
  for (const entry of data) {
    const key = formattedDate(entry.createdAt)
    const last = groups.at(-1)
    if (last?.key === key) {
      last.entries.push(entry)
      last.pages += entry.pages
    } else {
      groups.push({ key, pages: entry.pages, entries: [entry], span: 1 })
    }
  }
  layoutGroups(groups, cols)

  return (
    <MainGrid $cols={cols}>
      {groups.map((group) => (
        <Card
          size="small"
          key={group.key}
          title={group.key}
          extra={<span>{group.pages} pages</span>}
          style={{ gridColumn: `span ${group.span}` }}
        >
          <MonthGrid $span={group.span}>
            {group.entries.map((entry) => (
              <ViewBookItem key={entry.id} entry={entry} />
            ))}
          </MonthGrid>
        </Card>
      ))}
      {isMore && data.length ? (
        <>
          <SkeletonBookChangelogGroup cant={1} ref={inViewRef} />
          <SkeletonBookChangelogGroup cant={Math.min(3, cols)} />
          <SkeletonBookChangelogGroup cant={Math.min(2, cols)} />
        </>
      ) : undefined}
      {!data.length ? (
        isMore ? (
          <>
            <SkeletonBookChangelogGroup cant={Math.min(2, cols)} />
            <SkeletonBookChangelogGroup cant={Math.min(3, cols)} />
          </>
        ) : (
          <Empty />
        )
      ) : undefined}
    </MainGrid>
  )
}

export default BookTable
