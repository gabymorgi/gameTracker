import { Card, Flex } from 'antd'
import Img from '@/components/ui/Img'
import { Tag } from '@/components/ui/Tags'
import { BookTimelineEntry } from '@/ts/api/books'
import { stateTemplates } from '../BookList/BookItem'

interface ViewBookItemProps {
  entry: BookTimelineEntry
}

const ViewBookItem = ({ entry }: ViewBookItemProps) => {
  const { book } = entry

  return (
    <Card size="small" className="h-full">
      <Flex vertical gap="small" align="stretch">
        <Img
          title={book.name}
          href={book.imageUrl}
          width="100%"
          style={{ aspectRatio: '2/3' }}
          className="object-cover"
          src={book.imageUrl || ''}
          alt={`${book.name} header`}
          errorComponent={<span className="font-16">{book.name}</span>}
        />
        <div className="text-ellipsis text-center" title={book.name}>
          {book.name}
        </div>
        <Tag size="middle" justify="center" $hue={stateTemplates[book.state]}>
          {book.state}
        </Tag>
        <Flex justify="space-between" align="center">
          <span>{book.language}</span>
          <span>
            {entry.pages} / {book.pages} pages
          </span>
        </Flex>
      </Flex>
    </Card>
  )
}

export default ViewBookItem
