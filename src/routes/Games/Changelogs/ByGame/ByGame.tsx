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

const stateOrder = [
  'Playing',
  'Dropped',
  'Banned',
  'Won',
  'Completed',
  'Achievements',
]

const breakpointColumnsObj = {
  default: 3,
  1500: 2,
  1000: 1,
}

const ByGame = () => {
  const { queryParams } = useGameFilters()
  const page = useRef(1)
  const [data, setData] = useState<ChangelogsGame[]>([])
  const [isMore, setIsMore] = useState(true)

  const { mutate: getChangelogs, loading } = useMutation('changelogs/games')
  const { mutate: createChangelogs, loading: createLoading } =
    useMutation('changelogs/create')
  const { mutate: updateChangelogs, loading: updateLoading } =
    useMutation('changelogs/update')
  const { mutate: deleteChangelogs, loading: deleteLoading } =
    useMutation('changelogs/delete')

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData(() => [])
      }
      const newData = await getChangelogs({
        skip: page.current,
        take: 24,
        ...Object.fromEntries(
          Object.entries(queryParams).filter(([, v]) => v != null && v !== ''),
        ),
      })
      setIsMore(newData.length === 24)
      setData((prev) => [...prev, ...newData])
    },
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const addChangelog = async (values: ChangelogsGame['changeLogs'][number]) => {
    await createChangelogs(values)
    setData(
      data.map((d) => {
        if (d.id === values.gameId) {
          return {
            ...d,
            changeLogs: [values, ...d.changeLogs],
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
            changeLogs: d.changeLogs.map((c) => {
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
    values: ChangelogsGame['changeLogs'][number],
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
            changeLogs: d.changeLogs.filter((c) => c.id !== changelogId),
          }
        }
        return d
      }),
    )
  }

  const mergeChangelog = async (
    changelog: ChangelogsGame['changeLogs'][number],
    target: ChangelogsGame['changeLogs'][number],
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
            changeLogs: d.changeLogs
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
        spinning={loading || createLoading || updateLoading || deleteLoading}
      />
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
            ]
          : undefined}
      </Masonry>
    </Flex>
  )
}

export default ByGame
