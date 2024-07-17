import { Button, Col, Divider, Empty, Flex, Popconfirm, Row } from 'antd'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FullHeightCard, GameImg } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/Score'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { apiToBook } from '@/utils/format'
import { CreateBook } from './CreateBook'
import { query } from '@/hooks/useFetch'
import useBookFilters from '@/hooks/useBookFilters'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'
import UpdateBookModal from './UpdateBookModal'
import { BookI } from '@/ts/books'

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

  const delItem = useCallback(async (id: string) => {
    await query('books/delete', { id })
  }, [])

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
      <Flex vertical gap="middle">
        <Row gutter={[16, 16]}>
          {data?.map((b) => {
            return (
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key={b.id}>
                <FullHeightCard size="small">
                  <ScoreRibbon mark={b.mark} review={b.review} />
                  <Flex vertical gap="small" align="stretch" className="h-full">
                    <GameImg
                      title={b.name || undefined}
                      href={b.imageUrl}
                      width="250px"
                      height="120px"
                      className="object-cover self-align-center"
                      src={b.imageUrl || ''}
                      alt={`${b.name} header`}
                      $errorComponent={
                        <span className="font-16">{b.name}</span>
                      }
                    />
                    <Flex
                      justify="space-between"
                      align="center"
                      className="text-center"
                    >
                      <span>
                        {b.start
                          ? format(new Date(b.start), 'dd MMM yyyy')
                          : 'no data'}
                      </span>
                      <Divider type="vertical" />
                      <span>{b.words}</span>
                      <Divider type="vertical" />
                      <span>
                        {b.end
                          ? format(new Date(b.end), 'dd MMM yyyy')
                          : 'no data'}
                      </span>
                    </Flex>
                    {isAuthenticated ? (
                      <Flex
                        gap="small"
                        id="actions"
                        className="self-align-end mt-auto"
                      >
                        <Button
                          onClick={() => setSelectedBook(b)}
                          icon={<EditFilled />}
                        />
                        <Popconfirm
                          title="Are you sure you want to delete this game?"
                          onConfirm={() => delItem(b.id)}
                          icon={<DeleteFilled />}
                        >
                          <Button danger icon={<DeleteFilled />} />
                        </Popconfirm>
                      </Flex>
                    ) : undefined}
                  </Flex>
                </FullHeightCard>
              </Col>
            )
          })}
        </Row>
        {!data?.length ? (
          isMore ? (
            <SkeletonGameList />
          ) : (
            <Empty />
          )
        ) : isMore ? (
          <InView as="div" onChange={(inView) => inView && fetchData()}>
            in view
            <SkeletonGameList />
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
