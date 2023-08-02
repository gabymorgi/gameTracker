import { Button, Form, Popconfirm, Table } from 'antd'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GameI, CreatedGame, EndPoint } from '@/ts/index'
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
import { CreateGame } from './CreateGame'
import { Options, useLazyFetch } from '@/hooks/useFetch'
import useGameFilters from '@/hooks/useGameFilters'

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
  const { query, setQuery } = useGameFilters()
  const page = useRef(1)
  const { isAuthenticated } = useContext(AuthContext)
  const {
    data,
    loading: isLoading,
    fetchData,
  } = useLazyFetch<GameI[]>(EndPoint.GAMES)

  console.log(JSON.stringify(data))

  const [selectedGame, setSelectedGame] = useState<GameI>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    page.current = 1
    console.log(query)
    fetchData(Options.GET, { page: page.current, pageSize: 24, ...Object.fromEntries(
      Object.entries(query).filter(([, v]) => v != null && v !== ''),
    ) })
  }, [fetchData, query])

  const nextPage = useCallback(() => {
    page.current += 1
    fetchData(Options.GET, { page: page.current, pageSize: 24, ...query })
  }, [fetchData, query])

  const updateItem = async (game: CreatedGame) => {
    setLoading(true)
    if (!selectedGame) return
    await fetchData(Options.PUT, {}, { ...game, id: selectedGame.id })
    setSelectedGame(undefined)
    setLoading(false)
  }

  const delItem = useCallback(async (id: string) => {
    await fetchData(Options.DELETE, {}, { id })
  }, [fetchData])

  const addItem = useCallback(async (game: CreatedGame) => {
    await fetchData(Options.POST, {}, [game])
  }, [fetchData])

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
        state: <State state={g.stateId || undefined} />,
        hours: formatPlayedTime(g.playedTime + (g.extraPlayedTime || 0)),
        achievements: g.totalAchievements ? <Achievements obtained={g.obtainedAchievements} total={g.totalAchievements} /> : '-',
        tags: <Tags tags={g.gameTags || undefined} />,
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
        // pagination={{
        //   pageSize: pageSize,
        // }}
      />
      <Modal
        title='Update Game'
        open={!!selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        footer={[
          <Button key='back' onClick={() => setSelectedGame(undefined)} disabled={loading}>
            Cancel
          </Button>,
          <Button disabled={loading} loading={loading} key='submit' htmlType='submit' form={formId}>
            Update
          </Button>,
        ]}
      >
        <Form
          key={formId}
          id={formId}
          onFinish={updateItem}
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
