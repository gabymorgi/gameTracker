import {
  Button,
  Col,
  Divider,
  Empty,
  Flex,
  Popconfirm,
  Progress,
  Row,
} from 'antd'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GameI } from '@/ts/game'
import { FullHeightCard, GameImg } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { Tags } from '@/components/ui/Tags'
import { State } from '@/components/ui/State'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { apiToGame, formatPlayedTime } from '@/utils/format'
import { CreateGame } from './CreateGame'
import { query } from '@/hooks/useFetch'
import useGameFilters from '@/hooks/useGameFilters'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'
import UpdateGameModal from './UpdateGameModal'
import SkeletonGame from '@/components/skeletons/SkeletonGame'

const GameTable: React.FC = () => {
  const { queryParams } = useGameFilters()
  const page = useRef(1)
  const { isAuthenticated } = useContext(AuthContext)
  const [data, setData] = useState<GameI[]>([])
  const [isMore, setIsMore] = useState(true)

  const [selectedGame, setSelectedGame] = useState<GameI>()

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData([])
      }
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
      ).map(apiToGame)
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
    setData((prev) => prev.filter((g) => g.id !== id))
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
        </Flex>
      ) : undefined}
      <Flex vertical gap="middle">
        <Row gutter={[16, 16]}>
          {data?.map((g) => {
            return (
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key={g.id}>
                <FullHeightCard size="small">
                  <ScoreRibbon mark={g.mark} review={g.review} />
                  <Flex vertical gap="small" align="stretch" className="h-full">
                    <GameImg
                      title={g.name || undefined}
                      href={`https://steampowered.com/app/${g.appid}`}
                      width="250px"
                      height="120px"
                      className="object-cover self-align-center"
                      src={g.imageUrl || ''}
                      alt={`${g.name} header`}
                      $errorComponent={
                        <span className="font-16">{g.name}</span>
                      }
                    />
                    <Flex
                      justify="space-between"
                      align="center"
                      className="text-center"
                    >
                      <span>
                        {g.start
                          ? format(new Date(g.start), 'dd MMM yyyy')
                          : 'no data'}
                      </span>
                      <Divider type="vertical" />
                      <span>
                        {formatPlayedTime(
                          g.playedTime + (g.extraPlayedTime || 0),
                        )}
                      </span>
                      <Divider type="vertical" />
                      <span>
                        {g.end
                          ? format(new Date(g.end), 'dd MMM yyyy')
                          : 'no data'}
                      </span>
                    </Flex>
                    <State state={g.stateId || undefined} />
                    <div className="text-center">
                      {g.achievements.total ? (
                        <Progress
                          format={() =>
                            `${g.achievements.obtained} / ${g.achievements.total}`
                          }
                          percent={
                            (g.achievements.obtained / g.achievements.total) *
                            100
                          }
                          percentPosition={{ align: 'center', type: 'inner' }}
                          size={{
                            height: 20,
                          }}
                          strokeColor="hsl(180, 80%, 30%)"
                        />
                      ) : (
                        'no data'
                      )}
                    </div>
                    <Tags tags={g.tags} />
                    {isAuthenticated ? (
                      <Flex
                        gap="small"
                        id="actions"
                        className="self-align-end mt-auto"
                      >
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
                      </Flex>
                    ) : undefined}
                  </Flex>
                </FullHeightCard>
              </Col>
            )
          })}
          {data?.length && isMore ? (
            <>
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key="in-view">
                <InView as="div" onChange={(inView) => inView && fetchData()}>
                  <SkeletonGame />
                </InView>
              </Col>
              {Array.from({ length: 12 }).map((_, index) => (
                <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key={index}>
                  <SkeletonGame />
                </Col>
              ))}
            </>
          ) : undefined}
        </Row>
        {!data?.length ? isMore ? <SkeletonGameList /> : <Empty /> : undefined}
      </Flex>
      <UpdateGameModal
        selectedGame={selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default GameTable
