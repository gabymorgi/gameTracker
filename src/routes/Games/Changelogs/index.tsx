import { Button, Flex, Modal } from 'antd'
import ChangelogCard from './ChangelogCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import ChangelogForm from './ChangelogForm'
import { Link } from 'react-router-dom'
import Spin from '@/components/ui/Spin'
import { query } from '@/hooks/useFetch'
import Masonry from 'react-masonry-css'
import { InView } from 'react-intersection-observer'
import SkeletonGameChangelog from '@/components/skeletons/SkeletonGameChangelog'
import useGameFilters from '@/hooks/useGameFilters'
import { Filters } from '../GameList/Filters'
import { ChangelogsGameI } from '@/ts/game'
import { apiToChangelogGame } from '@/utils/format'
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

const Changelogs = () => {
  const { queryParams } = useGameFilters()
  const page = useRef(1)
  const [addition, setAddition] = useState(false)
  const [data, setData] = useState<ChangelogsGameI[]>([])
  const [isMore, setIsMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData(() => [])
      }
      const newData = (
        await query('changelogs/games', {
          pageNumber: page.current,
          pageSize: 24,
          ...Object.fromEntries(
            Object.entries(queryParams).filter(
              ([, v]) => v != null && v !== '',
            ),
          ),
        })
      ).map(apiToChangelogGame)
      setIsMore(newData.length === 24)
      setData((prev) => [...prev, ...newData])
    },
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const addChangelog = async (
    values: ChangelogsGameI['changeLogs'][number],
  ) => {
    setLoading(true)
    await query('changelogs/create', values)
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
    setAddition(false)
    setLoading(false)
  }

  const handleFinish = async (
    values: ChangelogsGameI['changeLogs'][number],
    id?: string,
    gameId?: string,
  ) => {
    if (!id || !gameId) {
      addChangelog(values)
    } else {
      editChangelog(values, id, gameId)
    }
  }

  const editChangelog = async (
    values: ChangelogsGameI['changeLogs'][number],
    id: string,
    gameId: string,
  ) => {
    setLoading(true)
    // console.log(values, id)
    await query('changelogs/update', values)
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
    setLoading(false)
  }

  const deleteChangelog = async (changelogId: string, gameId: string) => {
    setLoading(true)
    await query('changelogs/delete', { id: changelogId })
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
    setLoading(false)
  }

  const mergeChangelog = async (
    changelog: ChangelogsGameI['changeLogs'][number],
    target: ChangelogsGameI['changeLogs'][number],
    gameId: string,
  ) => {
    if (!target || !changelog) {
      message.error('Something went wrong')
      return
    }
    setLoading(true)
    const newChangelog = {
      ...target,
      stateId:
        stateOrder.indexOf(target.stateId) >
        stateOrder.indexOf(changelog.stateId)
          ? target.stateId
          : changelog.stateId,
      achievements: changelog.achievements + target.achievements,
      hours: changelog.hours + target.hours,
    }
    await query('changelogs/update', newChangelog)
    await query('changelogs/delete', { id: changelog.id })
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
    setLoading(false)
  }

  return (
    <Flex vertical gap="middle">
      <Spin spinning={loading} fullscreen />
      <Flex justify="space-between" align="center">
        <Button>
          <Link to="/">Go Back</Link>
        </Button>
        <h1>Changelogs</h1>
        <Button onClick={() => setAddition(true)} type="primary">
          Add changelog
        </Button>
      </Flex>
      <Modal
        title="Add changelog"
        open={addition}
        onCancel={() => setAddition(false)}
        footer={[
          <Button key="back" onClick={() => setAddition(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            form="changelog-form"
            htmlType="submit"
            type="primary"
          >
            Add
          </Button>,
        ]}
      >
        <ChangelogForm changelogId="" onFinish={addChangelog} />
      </Modal>
      <Filters />
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
          <>
            <InView as="div" onChange={(inView) => inView && fetchData()}>
              <SkeletonGameChangelog />
            </InView>
            <SkeletonGameChangelog cant={3} />
            <SkeletonGameChangelog cant={4} />
            <SkeletonGameChangelog cant={6} />
          </>
        ) : undefined}
      </Masonry>
    </Flex>
  )
}

export default Changelogs
