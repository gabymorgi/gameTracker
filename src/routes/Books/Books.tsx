import { Col, Empty, Flex, Row } from 'antd'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { CreateBook } from './CreateBook'
import useBookFilters from '@/hooks/useBookFilters'
import SkeletonBookList from '@/components/skeletons/SkeletonBookList'
import { InView } from 'react-intersection-observer'
import UpdateBookModal from './UpdateBookModal'
import BookItem from './BookItem'
import { Filters } from './Filters'
import SkeletonBook from '@/components/skeletons/SkeletonBook'
import { Book } from '@prisma/client'
import { useQuery } from '@/hooks/useFetch'

const BookList: React.FC = () => {
  const { queryParams } = useBookFilters()
  const page = useRef(1)
  const [isMore, setIsMore] = useState(true)
  const { isAuthenticated } = useContext(AuthContext)
  const { data, loading, fetchData } = useQuery('books/get')
  const [selectedBook, setSelectedBook] = useState<Book>()

  // const fetchData = useCallback(
  //   async (reset?: boolean) => {
  //     page.current = reset ? 1 : page.current + 1
  //     if (reset) {
  //       setData([])
  //     }
  //     const newData = (
  //       await query('books/get', {
  //         page: page.current,
  //         pageSize: 24,
  //         ...Object.fromEntries(
  //           Object.entries(queryParams).filter(
  //             ([, v]) => v != null && v !== '',
  //           ),
  //         ),
  //       })
  //     ).map(apiToBook)
  //     setData((prev) => [...prev, ...newData])
  //     setIsMore(newData.length === 24)
  //   },
  //   [queryParams],
  // )

  useEffect(() => {
    fetchData({
      skip: page.current,
      take: 24,
      ...Object.fromEntries(
        Object.entries(queryParams).filter(([, v]) => v != null && v !== ''),
      ),
    })
  }, [])

  const updateItem = (book: Book) => {
    // if (!selectedBook) return
    // const updatedData = data.map((b) => {
    //   if (b.id === selectedBook.id) {
    //     return book
    //   }
    //   return b
    // })
    // setData(updatedData)
    // setSelectedBook(undefined)
  }

  const addItem = useCallback(
    (book: Book) => {
      // const updatedData = [book, ...data]
      // setData(updatedData)
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
                <BookItem
                  book={b}
                  setSelectedBook={setSelectedBook}
                  delItem={() => {}}
                />
              </Col>
            )
          })}
          {data?.length && isMore ? (
            <>
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key="in-view">
                <InView as="div" onChange={(inView) => inView}>
                  {/* && fetchData() */}
                  <SkeletonBook />
                </InView>
              </Col>
              {Array.from({ length: 12 }).map((_, index) => (
                <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key={index}>
                  <SkeletonBook />
                </Col>
              ))}
            </>
          ) : undefined}
        </Row>
        {!data?.length ? isMore ? <SkeletonBookList /> : <Empty /> : undefined}
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
