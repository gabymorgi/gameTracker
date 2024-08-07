import { FullHeightCard } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { Button, Divider, Flex, Grid, Popconfirm } from 'antd'
import Img from '@/components/ui/Img'
import { Tag } from '@/components/ui/Tags'
import { useCallback, useContext } from 'react'
import { query } from '@/hooks/useFetch'
import { BookI, BookState } from '@/ts/books'
import { AuthContext } from '@/contexts/AuthContext'

const stateTemplates = {
  [BookState.READING]: 200,
  [BookState.FINISHED]: 100,
  [BookState.DROPPED]: 0,
  [BookState.WANT_TO_READ]: 300,
}

interface BookItemProps {
  book: BookI
  setSelectedBook: (b: BookI) => void
}

function BookItem(props: BookItemProps) {
  const breakPoints = Grid.useBreakpoint()
  const { isAuthenticated } = useContext(AuthContext)

  const delItem = useCallback(async (id: string) => {
    await query('books/delete', { id })
  }, [])

  return (
    <FullHeightCard size="small">
      <ScoreRibbon
        mark={props.book.mark}
        review={props.book.review}
        position="left"
      />
      <Flex gap="middle" className="h-full">
        <Img
          title={props.book.name || undefined}
          href={props.book.imageUrl}
          width={breakPoints.lg ? 160 : 120}
          style={{ aspectRatio: '2/3' }}
          className="object-cover self-align-center"
          src={props.book.imageUrl || ''}
          alt={`${props.book.name} header`}
          $errorComponent={<span className="font-16">{props.book.name}</span>}
        />
        <Flex
          vertical
          gap="middle"
          align="stretch"
          className="h-full force-flex-shrink flex-grow"
        >
          <div
            className="text-ellipsis text-center font-16"
            title={props.book.saga}
          >
            {props.book.saga}
          </div>
          <div className="text-ellipsis text-center" title={props.book.name}>
            {props.book.name}
          </div>
          <Flex justify="space-between" align="center" className="text-center">
            <span>
              {props.book.start
                ? format(new Date(props.book.start), 'dd MMM yyyy')
                : 'no data'}
            </span>
            <Divider type="vertical" />
            <span>
              {props.book.end
                ? format(new Date(props.book.end), 'dd MMM yyyy')
                : 'no data'}
            </span>
          </Flex>
          <Tag
            size="middle"
            justify="center"
            $hue={stateTemplates[props.book.state]}
          >
            {props.book.state ?? 'State not found'}
          </Tag>
          <Flex justify="space-between" align="center" className="text-center">
            <span>{props.book.language}</span>
            <span>{props.book.words}</span>
          </Flex>
          {isAuthenticated ? (
            <Flex gap="small" id="actions" className="self-align-end mt-auto">
              <Button
                onClick={() => props.setSelectedBook(props.book)}
                icon={<EditFilled />}
              />
              <Popconfirm
                title="Are you sure you want to delete this game?"
                onConfirm={() => delItem(props.book.id)}
                icon={<DeleteFilled />}
              >
                <Button danger icon={<DeleteFilled />} />
              </Popconfirm>
            </Flex>
          ) : undefined}
        </Flex>
      </Flex>
    </FullHeightCard>
  )
}

export default BookItem
