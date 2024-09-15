import { Flex } from 'antd'
import ChangelogCard from './ChangelogCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import Spin from '@/components/ui/Spin'
import { useMutation } from '@/hooks/useFetch'
import Masonry from 'react-masonry-css'
import { InView } from 'react-intersection-observer'
import SkeletonGameChangelog from '@/components/skeletons/SkeletonGameChangelog'
import useGameFilters from '@/hooks/useGameFilters'
import { message } from '@/contexts/GlobalContext'
import { Changelog, ChangelogsGame } from '@/ts/api/changelogs'
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

const breakpointColumnsObj = {
  default: 3,
  1500: 2,
  1000: 1,
}

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
      })
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

  return (
    <Flex vertical gap="middle">
      <Spin
        fullscreen
        spinning={createLoading || updateLoading || deleteLoading}
      />
      <GameFilters />
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data?.map((changelog) => (
          <ChangelogCard
            key={changelog.id}
            gameChangelog={changelog}
            onFinish={handleFinish}
            onDelete={deleteChangelog}
            onMerge={mergeChangelog}
          />
        ))}
        {data?.length && isMore ? (
          <InView
            key="skeleton-trigger"
            as="div"
            onChange={(inView) => inView && fetchData()}
          >
            <SkeletonGameChangelog />
          </InView>
        ) : undefined}
        {isMore
          ? [
              <SkeletonGameChangelog key="skeleton-1" cant={4} />,
              <SkeletonGameChangelog key="skeleton-2" cant={3} />,
              <SkeletonGameChangelog key="skeleton-3" cant={6} />,
              <SkeletonGameChangelog key="skeleton-4" cant={5} />,
              <SkeletonGameChangelog key="skeleton-5" cant={2} />,
              <SkeletonGameChangelog key="skeleton-6" cant={4} />,
              <SkeletonGameChangelog key="skeleton-7" cant={6} />,
              <SkeletonGameChangelog key="skeleton-8" cant={9} />,
              <SkeletonGameChangelog key="skeleton-9" cant={7} />,
            ]
          : undefined}
      </Masonry>
    </Flex>
  )
}

export default ByGame
