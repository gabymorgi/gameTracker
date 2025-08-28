import { Card, Col, Divider, Empty, Flex, Row } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { usePaginatedFetch } from '@/hooks/useFetch'
import SkeletonGameList from '@/components/skeletons/SkeletonGameList'
import { InView } from 'react-intersection-observer'
import UpdateGameModal from './UpdateGameModal'
import SkeletonGame from '@/components/skeletons/SkeletonGame'
import GameItem from './GameItem'
import { Game } from '@/ts/api/games'
import { UpdateParams } from '@/ts/api/common'
import { format } from 'date-fns'
import { mdiClock, mdiSeal } from '@mdi/js'
import { formatPlayedTime } from '@/utils/format'
import Icon from '@mdi/react'
import {
  ChangelogsGetGamesParams,
  ChangelogWithGame,
} from '@/ts/api/changelogs'
import useChangelogFilters from '@/hooks/useChangelogFilters'

interface ChangelogItem {
  key: string
  time: number
  ach: number
  changelogs: ChangelogWithGame[]
}

interface ExtraProps {
  time: number
  ach: number
}

function Extra(props: ExtraProps) {
  return (
    <Flex gap="small" align="center">
      <span>{props.ach}</span>
      <Icon path={mdiSeal} size="16px" />
      <Divider type="vertical" />
      <span>{formatPlayedTime(props.time)}</span>
      <Icon path={mdiClock} size="16px" />
    </Flex>
  )
}

const GameTable: React.FC = () => {
  const { queryParams } = useChangelogFilters()

  // const { isAuthenticated } = useContext(AuthContext)
  const { data, nextPage, isMore, reset, deleteValue } =
    usePaginatedFetch('changelogs')

  const [selectedGame, setSelectedGame] = useState<Game>()

  useEffect(() => {
    reset(queryParams as ChangelogsGetGamesParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  const updateItem = (game: UpdateParams<Game>) => {
    // eslint-disable-next-line no-console
    console.log(game)
    // updateValue(game)
    setSelectedGame(undefined)
  }

  const treeData = useMemo(() => {
    const newData: ChangelogItem[] = []
    // data should be sorted by date
    for (const changelog of data) {
      const key = format(changelog.createdAt, 'yyyy MMM')
      const last = newData.at(-1)
      if (last && last.key === key) {
        last.changelogs.push(changelog)
        last.time += changelog.hours
        last.ach += changelog.achievements
      } else {
        newData.push({
          key,
          changelogs: [changelog],
          time: changelog.hours,
          ach: changelog.achievements,
        })
      }
    }

    newData.forEach((item) => {
      item.changelogs.sort((a, b) => {
        return b.hours - a.hours
      })
    })

    return newData
  }, [data])

  return (
    <Flex vertical gap="middle">
      {/* {isAuthenticated ? (
        <Flex wrap gap="middle">
          <CreateGame handleAddItem={addValue} loading={loading} />
        </Flex>
      ) : undefined} */}
      <Flex vertical gap="middle">
        {treeData?.map((tData) => {
          return (
            <Card
              size="small"
              key={tData.key}
              title={tData.key}
              extra={<Extra time={tData.time} ach={tData.ach} />}
            >
              <Row gutter={[16, 16]}>
                {tData.changelogs.map((changelog) => (
                  <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key={changelog.id}>
                    <GameItem
                      monthPlayedTime={tData.time}
                      changelogGame={changelog}
                      delItem={deleteValue}
                      setSelectedGame={() => {}}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          )
        })}
        {data?.length && isMore ? (
          <>
            <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key="in-view">
              <InView as="div" onChange={(inView) => inView && nextPage()}>
                <SkeletonGame />
              </InView>
            </Col>
            {Array.from({ length: 12 }).map((_, index) => (
              <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key={index}>
                <SkeletonGame />
              </Col>
            ))}
          </>
        ) : undefined}
        {!data?.length ? isMore ? <SkeletonGameList /> : <Empty /> : undefined}
      </Flex>
      <UpdateGameModal
        loading={false}
        selectedGame={selectedGame}
        onCancel={() => setSelectedGame(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default GameTable
