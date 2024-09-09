import { Col, Empty, Flex, Row } from 'antd'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GameI } from '@/ts/game'
import { AuthContext } from '@/contexts/AuthContext'
import { apiToGame } from '@/utils/format'
import { CreateGame } from './CreateGame'
import { query } from '@/hooks/useFetch'
import useGameFilters from '@/hooks/useGameFilters'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'
import UpdateGameModal from './UpdateGameModal'
import SkeletonGame from '@/components/skeletons/SkeletonGame'
import GameItem from './GameItem'

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
                <GameItem
                  game={g}
                  onDelete={delItem}
                  onUpdate={setSelectedGame}
                />
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
