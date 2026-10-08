import { Card, Col, Empty, Flex, Row } from 'antd'
import { useEffect } from 'react'
import { useOnInView } from 'react-intersection-observer'
import { usePaginatedFetch } from '@/hooks/useFetch'
import useBookFilters from '@/hooks/useBookFilters'
import SkeletonBook from '@/components/skeletons/SkeletonBook'
import { formattedDate } from '@/utils/format'
import { BookTimelineEntry, BooksTimelineGetParams } from '@/ts/api/books'
import ViewBookItem from './ViewBookItem'

interface MonthGroup {
  key: string
  pages: number
  entries: BookTimelineEntry[]
}

const BookTable: React.FC = () => {
  const { queryParams } = useBookFilters()
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
      groups.push({ key, pages: entry.pages, entries: [entry] })
    }
  }

  return (
    <Flex vertical gap="middle">
      {groups.map((group, index) => (
        <Card
          size="small"
          key={group.key}
          title={group.key}
          extra={<span>{group.pages} pages</span>}
        >
          <Row gutter={[16, 16]}>
            {group.entries.map((entry) => (
              <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key={entry.id}>
                <ViewBookItem entry={entry} />
              </Col>
            ))}
            {isMore && index === groups.length - 1 ? (
              <Col xs={12} sm={8} lg={6} xl={4} xxl={3}>
                <SkeletonBook ref={inViewRef} />
              </Col>
            ) : undefined}
          </Row>
        </Card>
      ))}
      {!data.length ? isMore ? <SkeletonBook /> : <Empty /> : undefined}
    </Flex>
  )
}

export default BookTable
