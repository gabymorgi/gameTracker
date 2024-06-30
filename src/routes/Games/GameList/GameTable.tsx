import { Affix, Button, Col, Flex, Popconfirm, Row } from 'antd'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { GameI } from '@/ts/game'
import { TableContainer } from '@/styles/TableStyles'
import { Score, ScoreHeader } from '@/components/ui/Score'
import { Tags } from '@/components/ui/Tags'
import { State } from '@/components/ui/State'
import { Achievements } from '@/components/ui/Achievements'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { apiToGame, formatPlayedTime } from '@/utils/format'
import Img from '@/components/ui/Img'
import { CreateGame } from './CreateGame'
import { query } from '@/hooks/useFetch'
import useGameFilters from '@/hooks/useGameFilters'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import UpdateGameModal from './UpdateGameModal'

const GameTable: React.FC = () => {
  const { queryParams } = useGameFilters()
  const page = useRef(1)
  const { isAuthenticated } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<GameI[]>([])
  const [isMore, setIsMore] = useState(true)

  const [selectedGame, setSelectedGame] = useState<GameI>()

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData([])
      }
      setLoading(true)
      const newData = (
        await query('games/get', {
          page: page.current,
          pageSize: 24,
          ...Object.fromEntries(
            Object.entries(queryParams).filter(
              ([, v]) => v != null && v !== '',
            ),
          ),
        })
      ).map((g) => apiToGame(g))
      setLoading(false)
      setData((prev) => [...prev, ...newData])
      setIsMore(newData.length === 24)
    },
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const updateItem = (game: GameI) => {
    if (!selectedGame) return
    const updatedData = data.map((g) => {
      if (g.id === selectedGame.id) {
        return game
      }
      return g
    })
    setData(updatedData)
    setSelectedGame(undefined)
  }

  const delItem = useCallback(async (id: string) => {
    await query('games/delete', { id })
  }, [])

  const addItem = useCallback(
    (game: GameI) => {
      const updatedData = [game, ...data]
      setData(updatedData)
    },
    [data],
  )

  return (
    <Flex vertical gap="middle">
      {isAuthenticated ? (
        <Flex wrap gap="middle">
          <CreateGame handleAddItem={addItem} />
          <Button>
            <Link to="/games/recent">Recently Played</Link>
          </Button>
          <Button>
            <Link to="/games/massive">Massive Update</Link>
          </Button>
        </Flex>
      ) : undefined}
      <TableContainer vertical gap="middle">
        <Row gutter={[16, 16]}>
          {!data?.length && loading ? <SkeletonGameList /> : undefined}
          {data?.map((g) => {
            return (
              <Col xs={24} sm={12} lg={8} xl={6} xxl={24} key={g.id}>
                <div className="card">
                  <div id="name">
                    <a
                      href={`https://steampowered.com/app/${g.appid}`}
                      target="_blank"
                      rel="noreferrer"
                      title={g.name || undefined}
                    >
                      <Img
                        width="200px"
                        height="94px"
                        style={{ objectFit: 'cover' }}
                        src={g.imageUrl || ''}
                        alt={`${g.name} header`}
                        $errorComponent={
                          <span className="font-16">{g.name}</span>
                        }
                      />
                    </a>
                  </div>
                  <div id="date">
                    <div>
                      {g.start ? format(new Date(g.start), 'dd MMM yyyy') : '-'}
                    </div>
                    <div>
                      {g.end ? format(new Date(g.end), 'dd MMM yyyy') : '-'}
                    </div>
                  </div>
                  <div id="state">
                    <State state={g.stateId || undefined} />
                  </div>
                  <div id="hours">
                    {formatPlayedTime(g.playedTime + (g.extraPlayedTime || 0))}
                  </div>
                  <div id="achievements">
                    {g.achievements ? (
                      <Achievements
                        obtained={g.achievements.obtained}
                        total={g.achievements.total}
                      />
                    ) : (
                      '-'
                    )}
                  </div>
                  <div id="tags">
                    <Tags tags={g.tags} />
                  </div>
                  <div id="score">
                    <label>
                      <ScoreHeader />
                    </label>
                    <Score score={g.score} />
                  </div>
                  <Flex gap="small" id="actions">
                    {isAuthenticated ? (
                      <>
                        <Button
                          onClick={() => setSelectedGame(g)}
                          icon={<EditFilled />}
                        />
                        <Popconfirm
                          title="Are you sure you want to delete this game?"
                          onConfirm={() => delItem(g.id)}
                          icon={<DeleteFilled />}
                        >
                          <Button danger icon={<DeleteFilled />} />
                        </Popconfirm>
                      </>
                    ) : undefined}
                  </Flex>
                </div>
              </Col>
            )
          })}
        </Row>
        {data?.length && isMore ? (
          <InView as="div" onChange={(inView) => inView && fetchData()}>
            <SkeletonGameList />
          </InView>
        ) : undefined}
        <Affix offsetBottom={16}>
          <div className="flex justify-end">
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
      <UpdateGameModal
        selectedGame={selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default GameTable
