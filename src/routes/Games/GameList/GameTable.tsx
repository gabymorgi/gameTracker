import { Col, Empty, Flex, Row } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { CreateGame } from './CreateGame'
import { usePaginatedFetch } from '@/hooks/useFetch'
import useGameFilters from '@/hooks/useGameFilters'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'
import UpdateGameModal from './UpdateGameModal'
import SkeletonGame from '@/components/skeletons/SkeletonGame'
import GameItem from './GameItem'
import { Game } from '@/ts/api/games'
import { UpdateParams } from '@/ts/api/common'

const GameTable: React.FC = () => {
  const { queryParams } = useGameFilters()
  const { isAuthenticated } = useContext(AuthContext)
  const {
    data,
    loading,
    nextPage,
    isMore,
    reset,
    addValue,
    deleteValue,
    updateValue,
  } = usePaginatedFetch('games')

  const [selectedGame, setSelectedGame] = useState<Game>()

  useEffect(() => {
    reset(queryParams)
  }, [queryParams])

  const updateItem = (game: UpdateParams<Game>) => {
    updateValue(game)
    setSelectedGame(undefined)
  }

  return (
    <Flex vertical gap="middle">
      {isAuthenticated ? (
        <Flex wrap gap="middle">
          <CreateGame handleAddItem={addValue} loading={loading} />
        </Flex>
      ) : undefined}
      <Flex vertical gap="middle">
        <Row gutter={[16, 16]}>
          {data?.map((g) => {
            return (
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key={g.id}>
                <GameItem
                  game={g}
                  delItem={deleteValue}
                  setSelectedGame={setSelectedGame}
                />
              </Col>
            )
          })}
          {data?.length && isMore ? (
            <>
              <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key="in-view">
                <InView as="div" onChange={(inView) => inView && nextPage()}>
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
        loading={loading}
        selectedGame={selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default GameTable
