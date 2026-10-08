import { FullHeightCard } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { format } from 'date-fns'
import { mdiTrashCanOutline, mdiPencilOutline } from '@mdi/js'
import { Icon } from '@/components/ui/Icon'
import { Button, Divider, Flex, Grid, Listy, Popconfirm } from 'antd'
import styled from 'styled-components'
import Img from '@/components/ui/Img'
import { $Enums } from '#prisma-browser-client'
import { BookChangelog, BookWithChangelogs } from '@/ts/api/books'
import { StateIcon } from '@/components/ui/StateIcon'

export const stateTemplates = {
  [$Enums.BookState.READING]: 194,
  [$Enums.BookState.FINISHED]: 92,
  [$Enums.BookState.DROPPED]: 0,
  [$Enums.BookState.WANT_TO_READ]: 281,
}

const BookCard = styled(FullHeightCard)`
  .ant-card-head-title {
    white-space: normal;
    overflow: visible;
  }
`

const StyledListy = styled(Listy<BookChangelog>)`
  max-height: 194px;
  overflow: auto;
`

const StyledFlex = styled(Flex)`
  padding: 12px 0px;
`

interface BookItemProps {
  book: BookWithChangelogs
  setSelectedBook: (b: BookWithChangelogs) => void
  delItem: (id: string) => void
}

function BookItem(props: BookItemProps) {
  const breakPoints = Grid.useBreakpoint()

  return (
    <BookCard
      size="small"
      title={
        <Flex gap="middle">
          <ScoreRibbon
            mark={props.book.mark}
            review={props.book.review}
            position="left"
          />
          <div className="relative">
            <Img
              title={props.book.name || undefined}
              href={props.book.imageUrl}
              width={breakPoints.lg ? 160 : 120}
              style={{ aspectRatio: '2/3' }}
              className="object-cover self-align-center"
              src={props.book.imageUrl || ''}
              alt={`${props.book.name} header`}
              errorComponent={
                <span className="font-16">{props.book.name}</span>
              }
            />
            <StateIcon state={props.book.state} isFloating />
          </div>
          <StyledFlex
            vertical
            gap="middle"
            align="stretch"
            className="force-flex-shrink flex-grow"
          >
            <h2 className="text-ellipsis text-center" title={props.book.name}>
              {props.book.name}
            </h2>
            <h3
              className="text-ellipsis text-center"
              title={props.book.saga || undefined}
            >
              {props.book.saga}
            </h3>
            <Flex justify="space-between" align="center">
              <span>
                {props.book.start
                  ? format(new Date(props.book.start), 'dd MMM yyyy')
                  : 'no data'}
              </span>
              <Divider vertical />
              <span>
                {props.book.end
                  ? format(new Date(props.book.end), 'dd MMM yyyy')
                  : 'no data'}
              </span>
            </Flex>
            <Flex justify="space-between" align="center">
              <span>{props.book.language}</span>
              <span>{props.book.pages} pages</span>
            </Flex>
            <Flex gap="small" className="self-align-end mt-auto">
              <Button
                onClick={() => props.setSelectedBook(props.book)}
                icon={<Icon path={mdiPencilOutline} />}
              />
              <Popconfirm
                title="Are you sure you want to delete this book?"
                onConfirm={() => props.delItem(props.book.id)}
                icon={<Icon path={mdiTrashCanOutline} />}
              >
                <Button danger icon={<Icon path={mdiTrashCanOutline} />} />
              </Popconfirm>
            </Flex>
          </StyledFlex>
        </Flex>
      }
    >
      <StyledListy
        rowKey="id"
        items={props.book.changelogs}
        itemRender={(c) => (
          <Flex justify="space-between" className="w-full">
            <span>{format(new Date(c.createdAt), 'dd MMM yyyy')}</span>
            <span>{c.pages} pages</span>
          </Flex>
        )}
      />
    </BookCard>
  )
}

export default BookItem
