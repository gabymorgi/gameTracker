import { Flex, Masonry } from 'antd'
import ChangelogCard from './ChangelogCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import Spin from '@/components/ui/Spin'
import { useMutation } from '@/hooks/useFetch'
import { InView } from 'react-intersection-observer'
import SkeletonGameChangelog from '@/components/skeletons/SkeletonGameChangelog'
import useGameFilters from '@/hooks/useGameFilters'
import { message } from '@/contexts/GlobalContext'
import {
  Changelog,
  ChangelogsGame,
  ChangelogsGetGamesParams,
} from '@/ts/api/changelogs'
import { UpdateParams } from '@/ts/api/common'
import { GameFilters } from '@/components/Filters/GameFilters'

const stateOrder = [
  'Playing',
  'Dropped',
  'Banned',
  'Won',
  'Completed',
  'Achievements',
]

const pageSize = 24

const ByGame = () => {
  const { queryParams } = useGameFilters()
  const skip = useRef(0)
  const [data, setData] = useState<ChangelogsGame[]>([])
  const [isMore, setIsMore] = useState(true)

  const { mutate: getChangelogs } = useMutation('changelogs/games')
  const { mutate: createChangelogs, loading: createLoading } =
    useMutation('changelogs/create')
  const { mutate: updateChangelogs, loading: updateLoading } =
    useMutation('changelogs/update')
  const { mutate: deleteChangelogs, loading: deleteLoading } =
    useMutation('changelogs/delete')

  const fetchData = useCallback(
    async (reset?: boolean) => {
      skip.current = reset ? 0 : skip.current + pageSize
      if (reset) {
        setData(() => [])
      }
      const newData = await getChangelogs({
        ...queryParams,
        skip: skip.current,
        take: pageSize,
      } as ChangelogsGetGamesParams)
      setIsMore(newData.length === pageSize)
      setData((prev) => [...prev, ...newData])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const addChangelog = async (values: ChangelogsGame['changelogs'][number]) => {
    await createChangelogs(values)
    setData(
      data.map((d) => {
        if (d.id === values.gameId) {
          return {
            ...d,
            changelogs: [values, ...d.changelogs],
          }
        }
        return d
      }),
    )
  }

  const editChangelog = async (
    values: UpdateParams<Changelog>,
    id: string,
    gameId: string,
  ) => {
    await updateChangelogs(values)
    setData(
      data.map((d) => {
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
    values: ChangelogsGame['changelogs'][number],
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
    setData(
      data.map((d) => {
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
    changelog: ChangelogsGame['changelogs'][number],
    target: ChangelogsGame['changelogs'][number],
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
      hours: changelog.hours + target.hours,
    }
    await updateChangelogs(newChangelog)
    await deleteChangelogs({ id: changelog.id })
    setData(
      data.map((d) => {
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

  const items = data.map((changelog, i) => ({
    index: i,
    key: changelog.id,
    data: (
      <ChangelogCard
        key={changelog.id}
        gameChangelog={changelog}
        onFinish={handleFinish}
        onDelete={deleteChangelog}
        onMerge={mergeChangelog}
      />
    ),
  }))

  if (data?.length && isMore) {
    items.push({
      index: data.length,
      key: 'skeleton-trigger',
      data: (
        <InView
          key="skeleton-trigger"
          as="div"
          onChange={(inView) => inView && fetchData()}
        >
          <SkeletonGameChangelog />
        </InView>
      ),
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
      <Masonry
        columns={{ lg: 1, xl: 2, xxl: 3 }}
        gutter={16}
        items={items}
        itemRender={(item) => item.data}
      />
    </Flex>
  )
}

export default ByGame
