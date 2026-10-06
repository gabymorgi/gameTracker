import { Card, Col, Divider, Empty, Flex, Row } from 'antd'
import { useContext, useEffect } from 'react'
import { usePaginatedFetch, getCrudEndpoints } from '@/hooks/useFetch'
import GameItem from './GameItem/GameItem'
import { mdiClock, mdiSeal } from '@mdi/js'
import { formatPlayedTime, formattedDate } from '@/utils/format'
import { Icon } from '@mdi/react'
import useChangelogFilters from '@/hooks/useChangelogFilters'
import { AuthContext } from '@/contexts/AuthContext'
import { CreateGame } from './CreateGame'
import SkeletonGameMonths from '@/components/skeletons/SkeletonGameMonths'
import SkeletonGame from '@/components/skeletons/SkeletonGame'
import { useOnInView } from 'react-intersection-observer'
import { ChangelogWithGame, ChangelogsGetParams } from '@/ts/api/changelogs'
import { $SafeAny } from '@/ts'
import { Game } from '@/ts/api/games'

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
      <Divider vertical />
      <span>{formatPlayedTime(props.time)}</span>
      <Icon path={mdiClock} size="16px" />
    </Flex>
  )
}

const GameTable: React.FC = () => {
  const { queryParams } = useChangelogFilters()

  const { isAuthenticated } = useContext(AuthContext)

  const MONTH_PAGE_SIZE = 4
  const { data, nextPage, isMore, reset, setData } = usePaginatedFetch({
    endpoints: getCrudEndpoints('changelogs'),
    pageSize: isAuthenticated ? 24 : MONTH_PAGE_SIZE,
    getIsMore: !isAuthenticated
      ? (res) => {
          const months = new Set(res.map((c) => formattedDate(c.createdAt)))
          return months.size === MONTH_PAGE_SIZE
        }
      : undefined,
  })

  const inViewRef = useOnInView((inView) => {
    if (inView) {
      nextPage()
    }
  })

  useEffect(() => {
    reset(queryParams as ChangelogsGetParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, isAuthenticated])

  function handleGameUpdate(changelogId: string, updatedGame: Game) {
    setData((prev) =>
      prev.map((c) => {
        if (c.game.id !== updatedGame.id) return c
        const game = { ...c.game, ...updatedGame }
        return c.id === changelogId
          ? { ...c, game, state: game.state }
          : { ...c, game }
      }),
    )
  }

  const treeData: ChangelogItem[] = []
  // data should be sorted by date
  for (const changelog of data) {
    const key = formattedDate(changelog.createdAt)
    const last = treeData.at(-1)
    if (last && last.key === key) {
      last.changelogs.push(changelog)
      last.time += changelog.playedTime
      last.ach += changelog.achievements
    } else {
      treeData.push({
        key,
        changelogs: [changelog],
        time: changelog.playedTime,
        ach: changelog.achievements,
      })
    }
  }

  treeData.forEach((item) => {
    item.changelogs.sort((a, b) => {
      return b.playedTime - a.playedTime
    })
  })

  if (isMore && treeData.length) {
    treeData.at(-1)!.changelogs.push({
      id: `loading`,
    } as $SafeAny)
  }

  return (
    <Flex vertical gap="middle">
      {isAuthenticated ? (
        <Flex wrap gap="middle">
          <CreateGame />
        </Flex>
      ) : undefined}
      <Flex vertical gap="middle">
        {treeData?.map((tData) => {
          return (
            <Card
              size="small"
              key={tData.key}
              title={tData.key}
              extra={
                isAuthenticated ? (
                  <Extra time={tData.time} ach={tData.ach} />
                ) : undefined
              }
            >
              <Row gutter={[16, 16]}>
                {tData.changelogs.map((changelog) =>
                  changelog.id === 'loading' ? (
                    <Col
                      xs={12}
                      sm={8}
                      lg={6}
                      xl={4}
                      xxl={3}
                      key={changelog.id}
                    >
                      <SkeletonGame key={changelog.id} ref={inViewRef} />
                    </Col>
                  ) : (
                    <Col
                      xs={12}
                      sm={8}
                      lg={6}
                      xl={4}
                      xxl={3}
                      key={changelog.id}
                    >
                      <GameItem
                        monthPlayedTime={tData.time}
                        changelogGame={changelog}
                        onGameUpdate={handleGameUpdate}
                      />
                    </Col>
                  ),
                )}
              </Row>
            </Card>
          )
        })}
        {isMore ? (
          <>
            <SkeletonGameMonths gameAmount={9} />
            <SkeletonGameMonths gameAmount={7} />
            <SkeletonGameMonths gameAmount={5} />
          </>
        ) : !data?.length ? (
          <Empty />
        ) : undefined}
      </Flex>
    </Flex>
  )
}

export default GameTable
