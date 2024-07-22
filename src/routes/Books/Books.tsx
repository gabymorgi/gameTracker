import { Col, Empty, Flex, Row } from 'antd'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { apiToBook } from '@/utils/format'
import { CreateBook } from './CreateBook'
import { query } from '@/hooks/useFetch'
import useBookFilters from '@/hooks/useBookFilters'
import SkeletonBookList from '@/components/skeletons/SkeletonBookList'
import { InView } from 'react-intersection-observer'
import UpdateBookModal from './UpdateBookModal'
import { BookI } from '@/ts/books'
import BookItem from './BookItem'
import { Filters } from './Filters'

const BookList: React.FC = () => {
  const { queryParams } = useBookFilters()
  const page = useRef(1)
  const { isAuthenticated } = useContext(AuthContext)
  const [data, setData] = useState<BookI[]>([])
  const [isMore, setIsMore] = useState(true)

  const [selectedBook, setSelectedBook] = useState<BookI>()

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData([])
      }
      const newData = (
        await query('books/get', {
          page: page.current,
          pageSize: 24,
          ...Object.fromEntries(
            Object.entries(queryParams).filter(
              ([, v]) => v != null && v !== '',
            ),
          ),
        })
      ).map(apiToBook)
      setData((prev) => [...prev, ...newData])
      setIsMore(newData.length === 24)
    },
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const updateItem = (book: BookI) => {
    if (!selectedBook) return
    const updatedData = data.map((b) => {
      if (b.id === selectedBook.id) {
        return book
      }
      return b
    })
    setData(updatedData)
    setSelectedBook(undefined)
  }

  const addItem = useCallback(
    (book: BookI) => {
      const updatedData = [book, ...data]
      setData(updatedData)
    },
    [data],
  )

  return (
    <Flex vertical gap="middle">
      {isAuthenticated ? <CreateBook handleAddItem={addItem} /> : undefined}
      <Filters />
      <Flex vertical gap="middle">
        <Row gutter={[16, 16]}>
          {data?.map((b) => {
            return (
              <Col xs={24} md={12} xl={8} xxl={6} key={b.id}>
                <BookItem book={b} setSelectedBook={setSelectedBook} />
              </Col>
            )
          })}
        </Row>
        {!data?.length ? (
          isMore ? (
            <SkeletonBookList />
          ) : (
            <Empty />
          )
        ) : isMore ? (
          <InView as="div" onChange={(inView) => inView && fetchData()}>
            in view
            <SkeletonBookList />
          </InView>
        ) : undefined}
      </Flex>
      <UpdateBookModal
        selectedBook={selectedBook}
        onCancel={() => setSelectedBook(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default BookList
