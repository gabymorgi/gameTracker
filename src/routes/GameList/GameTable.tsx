import { Affix, Button, Col, Form, Popconfirm, Row } from 'antd'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GameI, CreatedGame, EndPoint } from '@/ts/index'
import { TableContainer } from '@/styles/TableStyles'
import { Score, ScoreHeader } from '@/components/ui/Score'
import { Tags } from '@/components/ui/Tags'
import { State } from '@/components/ui/State'
import { Achievements } from '@/components/ui/Achievements'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { formatPlayedTime, numberToDate } from '@/utils/format'
import Img from '@/components/ui/Img'
import Modal from '@/components/ui/Modal'
import { InputGame } from '@/components/Form/InputGame'
import { CreateGame } from './CreateGame'
import { Options, useLazyFetch } from '@/hooks/useFetch'
import useGameFilters from '@/hooks/useGameFilters'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'

const GameTable: React.FC = () => {
  const { query } = useGameFilters()
  const page = useRef(1)
  const { isAuthenticated } = useContext(AuthContext)
  const {
    data,
    loading: isLoading,
    fetchData,
  } = useLazyFetch<GameI[]>(EndPoint.GAMES)

  const [selectedGame, setSelectedGame] = useState<GameI>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    page.current = 1
    fetchData(Options.GET, {
      page: page.current, pageSize: 24, ...Object.fromEntries(
        Object.entries(query).filter(([, v]) => v != null && v !== ''),
      )
    })
  }, [fetchData, query])

  const nextPage = useCallback(() => {
    if (isLoading) return
    page.current += 1
    fetchData(Options.GET, { page: page.current, pageSize: 24, ...query })
  }, [fetchData, isLoading, query])

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

  const formId = `form-${selectedGame?.id}`
  return (
    <div className='flex flex-col gap-16'>
      {isAuthenticated && (
        <CreateGame handleAddItem={addItem} />
      )}
      <TableContainer>
        <Row gutter={[16, 16]}>
          <Col id="header" span={24}>
            <div className='card'>
              <div id="name">Name</div>
              <div id="date">Date</div>
              <div id="state">State</div>
              <div id="hours">Hours</div>
              <div id="achievements">Achievements</div>
              <div id="tags">Tags</div>
              <div id="score"><ScoreHeader /></div>
              {isAuthenticated ? <div id="actions">Actions</div> : undefined}
            </div>
          </Col>
          {!data?.length && isLoading ? (
            <SkeletonGameList />
          ) : undefined}
          {data?.map((g) => {
            return (
              <Col xs={24} sm={12} lg={8} xl={6} xxl={24} key={g.id}>
                <div className='card'>
                  <div id="name">
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
                  </div>
                  <div id="date">
                    <div>{g.start ? format(numberToDate(g.start), 'dd MMM yyyy') : '-'}</div>
                    <div>{g.end ? format(numberToDate(g.end), 'dd MMM yyyy') : '-'}</div>
                  </div>
                  <div id="state"><State state={g.stateId || undefined} /></div>
                  <div id="hours">{formatPlayedTime(g.playedTime + (g.extraPlayedTime || 0))}</div>
                  <div id="achievements">{g.totalAchievements ? <Achievements obtained={g.obtainedAchievements} total={g.totalAchievements} /> : '-'}</div>
                  <div id="tags"><Tags tags={g.gameTags || undefined} /></div>
                  <div id="score">
                    <label><ScoreHeader /></label>
                    <Score score={g.score} />
                  </div>
                  <div id="actions" className='flex gap-8'>
                    {isAuthenticated ? (
                      <>
                        <Button onClick={() => setSelectedGame(g)} icon={<EditFilled />} />
                        <Popconfirm
                          title='Are you sure you want to delete this game?'
                          onConfirm={() => delItem(g.id)}
                          icon={<DeleteFilled />}
                        >
                          <Button danger icon={<DeleteFilled />} />
                        </Popconfirm>
                      </>
                    ) : undefined}
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
        {data?.length ? (
          <InView
            as="div"
            onChange={(inView) => inView && nextPage()}
          >
            <SkeletonGameList />
          </InView>
        ) : undefined}
        <Affix offsetBottom={16}>
          <div className='flex justify-end'>
            <Button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }}
            >
              scroll to top
            </Button>
          </div>
        </Affix>
      </TableContainer>
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
    </div>
  )
}

export default GameTable
