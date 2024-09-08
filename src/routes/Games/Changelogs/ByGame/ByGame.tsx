import { Flex } from 'antd'
import ChangelogCard from './ChangelogCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import Spin from '@/components/ui/Spin'
import { query, usePaginatedFetch, useQuery } from '@/hooks/useFetch'
import Masonry from 'react-masonry-css'
import { InView } from 'react-intersection-observer'
import SkeletonGameChangelog from '@/components/skeletons/SkeletonGameChangelog'
import useGameFilters from '@/hooks/useGameFilters'
import { apiToChangelogGame, formatQueryParams } from '@/utils/format'
import { message } from '@/contexts/GlobalContext'

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
  // const page = useRef(1)
  // const [data, setData] = useState<ChangelogsGameI[]>([])
  // const [isMore, setIsMore] = useState(true)
  // const [loading, setLoading] = useState(false)

  const { data, fetchData, loading } = useQuery('changelogs/games')

  useEffect(() => {
    // reset(queryParams)
  }, [queryParams])

  // const addChangelog = async (
  //   values: ChangelogGame,
  // ) => {
  //   setLoading(true)
  //   await query('changelogs/create', values)
  //   setData(
  //     data.map((d) => {
  //       if (d.id === values.gameId) {
  //         return {
  //           ...d,
  //           changeLogs: [values, ...d.changeLogs],
  //         }
  //       }
  //       return d
  //     }),
  //   )
  //   setLoading(false)
  // }

  // const editChangelog = async (
  //   values: ChangelogsGameI['changeLogs'][number],
  //   id: string,
  //   gameId: string,
  // ) => {
  //   setLoading(true)
  //   // console.log(values, id)
  //   try {
  //     await query('changelogs/update', values)
  //     setData(
  //       data.map((d) => {
  //         if (d.id === gameId) {
  //           return {
  //             ...d,
  //             changeLogs: d.changeLogs.map((c) => {
  //               if (c.id === id) {
  //                 return {
  //                   ...c,
  //                   ...values,
  //                 }
  //               }
  //               return c
  //             }),
  //           }
  //         }
  //         return d
  //       }),
  //     )
  //   } catch (error) {
  //     message.error('Something went wrong')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleFinish = async (
  //   values: ChangelogsGameI['changeLogs'][number],
  //   id?: string,
  //   gameId?: string,
  // ) => {
  //   if (!id || !gameId) {
  //     addChangelog(values)
  //   } else {
  //     editChangelog(values, id, gameId)
  //   }
  // }

  // const deleteChangelog = async (changelogId: string, gameId: string) => {
  //   setLoading(true)
  //   await query('changelogs/delete', { id: changelogId })
  //   setData(
  //     data.map((d) => {
  //       if (d.id === gameId) {
  //         return {
  //           ...d,
  //           changeLogs: d.changeLogs.filter((c) => c.id !== changelogId),
  //         }
  //       }
  //       return d
  //     }),
  //   )
  //   setLoading(false)
  // }

  // const mergeChangelog = async (
  //   changelog: ChangelogsGameI['changeLogs'][number],
  //   target: ChangelogsGameI['changeLogs'][number],
  //   gameId: string,
  // ) => {
  //   if (!target || !changelog) {
  //     message.error('Something went wrong')
  //     return
  //   }
  //   setLoading(true)
  //   const newChangelog = {
  //     ...target,
  //     stateId:
  //       stateOrder.indexOf(target.stateId) >
  //       stateOrder.indexOf(changelog.stateId)
  //         ? target.stateId
  //         : changelog.stateId,
  //     achievements: changelog.achievements + target.achievements,
  //     hours: changelog.hours + target.hours,
  //   }
  //   await query('changelogs/update', newChangelog)
  //   await query('changelogs/delete', { id: changelog.id })
  //   setData(
  //     data.map((d) => {
  //       if (d.id === gameId) {
  //         return {
  //           ...d,
  //           changeLogs: d.changeLogs
  //             .filter((c) => c.id !== changelog.id)
  //             .map((c) => {
  //               if (c.id === target.id) {
  //                 return {
  //                   ...c,
  //                   ...newChangelog,
  //                 }
  //               }
  //               return c
  //             }),
  //         }
  //       }
  //       return d
  //     }),
  //   )
  //   setLoading(false)
  // }

  return (
    <Flex vertical gap="middle">
      <Spin spinning={loading} fullscreen />
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
