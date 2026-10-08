import { Card, Flex } from 'antd'
import Img from '@/components/ui/Img'
import { BookTimelineEntry } from '@/ts/api/books'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'

interface ViewBookItemProps {
  entry: BookTimelineEntry
}

const ViewBookItem = ({ entry }: ViewBookItemProps) => {
  const { book } = entry

  return (
    <Card size="small" className="h-full">
      <Flex vertical gap="small" align="stretch">
        <ScoreRibbon mark={book.mark} review={book.review} />
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
        <h3 className="text-ellipsis text-center" title={book.name}>
          {book.name}
        </h3>
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
