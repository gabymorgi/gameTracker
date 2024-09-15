import { Col, Empty, Flex, Row } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { CreateBook } from './CreateBook'
import useBookFilters from '@/hooks/useBookFilters'
import SkeletonBookList from '@/components/skeletons/SkeletonBookList'
import { InView } from 'react-intersection-observer'
import UpdateBookModal from './UpdateBookModal'
import BookItem from './BookItem'
import SkeletonBook from '@/components/skeletons/SkeletonBook'
import { usePaginatedFetch } from '@/hooks/useFetch'
import { Book } from '@/ts/api/books'
import { UpdateParams } from '@/ts/api/common'
import { BookFilters } from '@/components/Filters/BookFilters'

const BookList: React.FC = () => {
  const { queryParams } = useBookFilters()
  const { isAuthenticated } = useContext(AuthContext)
  const {
    data,
    loading,
    nextPage,
    isMore,
    reset,
    addValue,
    deleteValue,
    updateValue,
  } = usePaginatedFetch('books')
  const [selectedBook, setSelectedBook] = useState<Book>()

  useEffect(() => {
    reset(queryParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  function updateItem(book: UpdateParams<Book>) {
    if (!selectedBook) return
    updateValue(book)
    setSelectedBook(undefined)
  }

  return (
    <Flex vertical gap="middle">
      {isAuthenticated ? (
        <div>
          <CreateBook handleAddItem={addValue} loading={loading} />
        </div>
      ) : undefined}
      <BookFilters />
      <Flex vertical gap="middle">
        <Row gutter={[16, 16]}>
          {data?.map((b) => {
            return (
              <Col xs={24} md={12} xl={8} xxl={6} key={b.id}>
                <BookItem
                  book={b}
                  setSelectedBook={setSelectedBook}
                  delItem={deleteValue}
                />
              </Col>
            )
          })}
          {data?.length && isMore ? (
            <>
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key="in-view">
                <InView as="div" onChange={(inView) => inView && nextPage()}>
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
        loading={loading}
        selectedBook={selectedBook}
        onCancel={() => setSelectedBook(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default BookList
