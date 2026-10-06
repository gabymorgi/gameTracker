import { Col, Flex, Row } from 'antd'
import GameChangelogCard from './GameChangelogCard'
import { useEffect, useState } from 'react'
import Spin from '@/components/ui/Spin'
import { useMutation, usePaginatedFetch } from '@/hooks/useFetch'
import { useOnInView } from 'react-intersection-observer'
import SkeletonGameChangelog from '@/components/skeletons/SkeletonGameChangelog'
import useGameFilters from '@/hooks/useGameFilters'
import { message } from '@/contexts/GlobalContext'
import { UpdateParams } from '@/ts/api/common'
import { GameFilters } from '@/components/Filters/GameFilters'
import { $Enums, Changelog as PrismaChangelog } from '#prisma-browser-client'
import { Game, GameGetParams, GameWithChangelogs } from '@/ts/api/games'
import UpdateGameModal from './UpdateGameModal'

const stateOrder = [
  $Enums.GameState.PLAYING,
  $Enums.GameState.DROPPED,
  $Enums.GameState.BANNED,
  $Enums.GameState.WON,
  $Enums.GameState.COMPLETED,
  $Enums.GameState.ACHIEVEMENTS,
]

const pageSize = 12

const ByGame = () => {
  const { queryParams } = useGameFilters()
  const [editingGame, setEditingGame] = useState<GameWithChangelogs>()
  const { data, nextPage, isMore, reset, setData } = usePaginatedFetch({
    endpoints: { get: 'games/getWithChangelogs' },
    pageSize,
  })

  const { mutate: createChangelogs, loading: createLoading } =
    useMutation('changelogs/create')
  const { mutate: updateChangelogs, loading: updateLoading } =
    useMutation('changelogs/update')
  const { mutate: deleteChangelogs, loading: deleteLoading } =
    useMutation('changelogs/delete')

  const inViewRef = useOnInView((inView) => {
    if (inView) {
      nextPage()
    }
  })

  useEffect(() => {
    reset(queryParams as GameGetParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  const addChangelog = async (values: PrismaChangelog) => {
    const response = await createChangelogs(values)
    setData((prev) =>
      prev.map((d) => {
        if (d.id === values.gameId) {
          return {
            ...d,
            changelogs: [
              ...d.changelogs,
              {
                ...response,
                gameId: values.gameId,
              },
            ],
          }
        }
        return d
      }),
    )
  }

  const editChangelog = async (
    values: UpdateParams<PrismaChangelog>,
    id: string,
    gameId: string,
  ) => {
    await updateChangelogs(values)
    setData((prev) =>
      prev.map((d) => {
        if (d.id === gameId) {
          return {
            ...d,
            changelogs: d.changelogs.map((c) => {
              if (c.id === id) {
                return {
                  ...c,
                  ...values,
                }
              }
              return c
            }),
          }
        }
        return d
      }),
    )
  }

  const handleFinish = async (
    values: PrismaChangelog,
    id?: string,
    gameId?: string,
  ) => {
    if (!id || !gameId) {
      addChangelog(values)
    } else {
      editChangelog(values, id, gameId)
    }
  }

  const deleteChangelog = async (changelogId: string, gameId: string) => {
    await deleteChangelogs({ id: changelogId })
    setData((prev) =>
      prev.map((d) => {
        if (d.id === gameId) {
          return {
            ...d,
            changelogs: d.changelogs.filter((c) => c.id !== changelogId),
          }
        }
        return d
      }),
    )
  }

  const mergeChangelog = async (
    changelog: PrismaChangelog,
    target: PrismaChangelog,
    gameId: string,
  ) => {
    if (!target || !changelog) {
      message.error('Something went wrong')
      return
    }
    const newChangelog = {
      ...target,
      state:
        stateOrder.indexOf(target.state) > stateOrder.indexOf(changelog.state)
          ? target.state
          : changelog.state,
      achievements: changelog.achievements + target.achievements,
      hours: changelog.playedTime + target.playedTime,
    }
    await updateChangelogs(newChangelog)
    await deleteChangelogs({ id: changelog.id })
    setData((prev) =>
      prev.map((d) => {
        if (d.id === gameId) {
          return {
            ...d,
            changelogs: d.changelogs
              .filter((c) => c.id !== changelog.id)
              .map((c) => {
                if (c.id === target.id) {
                  return {
                    ...c,
                    ...newChangelog,
                  }
                }
                return c
              }),
          }
        }
        return d
      }),
    )
  }

  const handleGameUpdated = (game: Game) => {
    setData((prev) =>
      prev.map((d) => (d.id === game.id ? { ...d, ...game } : d)),
    )
  }

  const items = data.map((changelog, i) => ({
    index: i,
    key: changelog.id,
    data: (
      <GameChangelogCard
        key={changelog.id}
        gameChangelog={changelog}
        onFinish={handleFinish}
        onDelete={deleteChangelog}
        onEdit={setEditingGame}
        onMerge={mergeChangelog}
      />
    ),
  }))

  if (data?.length && isMore) {
    items.push({
      index: data.length,
      key: 'skeleton-trigger',
      data: <SkeletonGameChangelog ref={inViewRef} />,
    })
  }

  if (isMore) {
    for (let i = 0; i < 9; i++) {
      items.push({
        index: data.length + i + 1,
        key: `skeleton-${i}`,
        data: <SkeletonGameChangelog cant={(i * 7 + 3) % 10} />,
      })
    }
  }

  return (
    <Flex vertical gap="middle">
      <Spin
        fullscreen
        spinning={createLoading || updateLoading || deleteLoading}
      />
      <GameFilters />
      <UpdateGameModal
        selectedGame={editingGame}
        onCancel={() => setEditingGame(undefined)}
        onUpdated={handleGameUpdated}
      />
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.key} xs={24} xl={12} xxl={8}>
            {item.data}
          </Col>
        ))}
      </Row>
    </Flex>
  )
}

export default ByGame
