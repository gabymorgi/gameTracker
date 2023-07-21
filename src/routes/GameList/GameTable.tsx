import { Button, Form, Popconfirm, Select, Table } from 'antd'
import React, { useContext, useMemo, useState } from 'react'
import { GameI, DocumentGameI } from '@/ts/index'
import { TableContainer } from '@/styles/TableStyles'
import { FlexSection } from '@/components/ui/Layout'
import { Score, ScoreHeader } from '@/components/ui/Score'
import { Tags } from '@/components/ui/Tags'
import { State } from '@/components/ui/State'
import { Achievements } from '@/components/ui/Achievements'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { ColumnsType } from 'antd/lib/table'
import { formatPlayedTime, numberToDate } from '@/utils/format'
import Img from '@/components/ui/Img'
import Modal from '@/components/ui/Modal'
import { InputGame } from '@/components/Form/InputGame'
import { useQuery } from '@/hooks/useCollectionData'
import useGameFilters from '@/hooks/useGameFilters'
import { CreateGame } from './CreateGame'
// import { Filter, Order, useQuery } from '@/hooks/useCollectionData'
// import { useSearchParams } from 'react-router-dom'
// import useGameFilters from '@/hooks/useGameFilters'

interface GameDataSourceI {
  key: string;
  name: JSX.Element;
  date: JSX.Element;
  state: JSX.Element;
  hours: string;
  achievements: string | JSX.Element;
  tags: JSX.Element;
  score: JSX.Element;
  actions: JSX.Element | undefined;
}

const GameTable: React.FC = () => {
  const { setQuery, pageSize, queryFilters, queryOrder } = useGameFilters()
  const { isAuthenticated } = useContext(AuthContext)
  const {
    data,
    getNextPage,
    addItem,
    editItem,
    delItem,
    isLastPage,
    isLoading,
  } = useQuery<GameI>(
    undefined, // CollectionType.Games,
    pageSize,
    queryOrder,
    queryFilters,
  )

  const [selectedGame, setSelectedGame] = useState<GameI>()
  const [loading, setLoading] = useState(false)

  const handleFinish = async (game: DocumentGameI) => {
    setLoading(true)
    if (!selectedGame) return
    await editItem(selectedGame.id, game)
    setSelectedGame(undefined)
    setLoading(false)
  }

  const tableColumns: ColumnsType<GameDataSourceI> = useMemo(() => {
    const column: ColumnsType<GameDataSourceI> = [
      { title: 'Name', dataIndex: 'name', align: 'center', width: 200 },
      { title: 'Date', dataIndex: 'date', align: 'center', width: 120 },
      { title: 'Hours', dataIndex: 'hours', align: 'center' },
      { title: 'State', dataIndex: 'state', align: 'center' },
      { title: 'Achievements', dataIndex: 'achievements', align: 'center' },
      { title: 'Tags', dataIndex: 'tags', align: 'center' },
      { title: <ScoreHeader />, dataIndex: 'score', width: 225 },
    ]

    if (isAuthenticated) {
      column.push({ title: 'Actions', dataIndex: 'actions', align: 'center' })
    }
    return column
  }, [isAuthenticated])

  const dataSource = useMemo(() => {
    if (!data) return []
    return data.map((g) => {
      return {
        key: g.id,
        name: (
          <a
            href={`https://steampowered.com/app/${g.appid}`}
            target='_blank'
            rel='noreferrer'
            title={g.name || undefined}
          >
            <Img
              width='200px'
              height='94px'
              style={{ objectFit: 'cover' }}
              src={g.imageUrl || ''}
              alt={`${g.name} header`}
              $errorComponent={<span className='font-16'>{g.name}</span>}
            />
          </a>
        ),
        date: (
          <div>
            <div>{g.start ? format(numberToDate(g.start), 'dd MMM yyyy') : '-'}</div>
            <div>{g.end ? format(numberToDate(g.end), 'dd MMM yyyy') : '-'}</div>
          </div>
        ),
        state: <State state={g.state || undefined} />,
        hours: formatPlayedTime(g.hours || 0),
        achievements: g.achievements ? <Achievements achievements={g.achievements} /> : '-',
        tags: <Tags tags={g.tags || undefined} />,
        score: <Score score={g.score} />,
        actions: isAuthenticated ? (
          <FlexSection gutter={8}>
            <Button onClick={() => setSelectedGame(g)} icon={<EditFilled />} />
            <Popconfirm
              title='Are you sure you want to delete this game?'
              onConfirm={() => delItem(g.id)}
              icon={<DeleteFilled />}
            >
              <Button danger icon={<DeleteFilled />} />
            </Popconfirm>
          </FlexSection>
        ) : undefined,
      }
    })
  }, [data, delItem, isAuthenticated])

  const formId = `form-${selectedGame?.id}`
  return (
    <TableContainer>
      {isAuthenticated && (
        <CreateGame handleAddItem={addItem} />
      )}
      <Table
        loading={isLoading}
        columns={tableColumns}
        dataSource={dataSource}
        pagination={{
          pageSize: pageSize,
        }}
      />
      <div className='flex justify-end gap-16'>
        <Select defaultValue={pageSize} onChange={(value) => setQuery({ pageSize: value })}>
          <Select.Option value={24}>24 / page</Select.Option>
          <Select.Option value={48}>48 / page</Select.Option>
          <Select.Option value={96}>96 / page</Select.Option>
        </Select>
        <Button
          type='primary'
          onClick={() => getNextPage()}
          disabled={isLastPage}
          loading={isLoading}
        >
          Load Next Page
        </Button>
      </div>
      <Modal
        title='Update Game'
        open={!!selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        footer={[
          <Button key='back' onClick={() => setSelectedGame(undefined)} disabled={loading}>
            Cancel
          </Button>,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore form is not recognized as a valid prop
          <Button disabled={loading} loading={loading} key='submit' htmlType='submit' form={formId}>
            Update
          </Button>,
        ]}
      >
        <Form
          key={formId}
          id={formId}
          onFinish={handleFinish}
          layout='vertical'
          className='p-16'
          initialValues={selectedGame}
        >
          <InputGame />
        </Form>
      </Modal>
    </TableContainer>
  )
}

export default GameTable
