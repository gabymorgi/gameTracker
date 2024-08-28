import { Divider, Flex } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Spin from '@/components/ui/Spin'
import { query } from '@/hooks/useFetch'
import { InView } from 'react-intersection-observer'
import useGameFilters from '@/hooks/useGameFilters'
import { ChangelogI } from '@/ts/game'
import { apiToChangelog, formatPlayedTime } from '@/utils/format'
import { enUS } from 'date-fns/locale'
import { Month } from 'date-fns'
import ChangelogListItem from './ChangelogListItem'
import { NodeBranch, Tree, TreeNode } from '@/components/ui/Tree'
import Icon from '@mdi/react'
import { mdiSeal } from '@mdi/js'
import {
  skeletonChangelogMonthNode,
  SkeletonChangelogNodeLeaf,
  skeletonChangelogYearNode,
} from '@/components/skeletons/SkeletonChangelogNode'

type TreeChangeLog = Record<string, Record<string, Record<string, ChangelogI>>>

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
    </Flex>
  )
}

const Timeline = () => {
  const { queryParams } = useGameFilters()
  const page = useRef(1)
  const [data, setData] = useState<TreeChangeLog>()
  const [isMore, setIsMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (reset?: boolean) => {
      page.current = reset ? 1 : page.current + 1
      if (reset) {
        setData(undefined)
      }
      const newData = (
        await query('changelogs/get', {
          pageNumber: page.current,
          pageSize: 24,
          ...Object.fromEntries(
            Object.entries(queryParams).filter(
              ([, v]) => v != null && v !== '',
            ),
          ),
        })
      ).map(apiToChangelog)
      setIsMore(newData.length === 24)
      const newDataTree: TreeChangeLog = {
        ...data,
      }
      for (const changelog of newData) {
        const year = 'a' + changelog.createdAt.getFullYear()
        const month = 'a' + changelog.createdAt.getMonth()
        if (newDataTree && newDataTree[year]) {
          if (newDataTree[year][month]) {
            newDataTree[year][month][changelog.id] = changelog
          } else {
            newDataTree[year][month] = {
              [changelog.id]: changelog,
            }
          }
        } else {
          newDataTree[year] = {
            [month]: {
              [changelog.id]: changelog,
            },
          }
        }
      }
      setData(newDataTree)
    },
    [queryParams],
  )

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  const addChangelog = async (values: ChangelogI) => {
    setLoading(true)
    await query('changelogs/create', values)
    setData((prev) => {
      const year = 'a' + values.createdAt.getFullYear()
      const month = 'a' + values.createdAt.getMonth()
      if (prev && prev[year]) {
        if (prev[year][month]) {
          prev[year][month][values.id] = values
        } else {
          prev[year][month] = {
            [values.id]: values,
          }
        }
      } else {
        prev![year] = {
          [month]: {
            [values.id]: values,
          },
        }
      }
      return prev
    })
    setLoading(false)
  }

  const editChangelog = async (values: ChangelogI, id: string) => {
    setLoading(true)
    // console.log(values, id)
    await query('changelogs/update', values)
    setData((prev) => {
      const year = 'a' + values.createdAt.getFullYear()
      const month = 'a' + values.createdAt.getMonth()
      if (prev && prev[year] && prev[year][month]) {
        prev[year][month][id] = values
      }
      return prev
    })
    setLoading(false)
  }

  const handleFinish = async (values: ChangelogI, id?: string) => {
    if (!id) {
      addChangelog(values)
    } else {
      editChangelog(values, id)
    }
  }

  const deleteChangelog = async (
    year: string,
    month: string,
    changelogId: string,
  ) => {
    setLoading(true)
    await query('changelogs/delete', { id: changelogId })
    setData((prev) => {
      delete prev![year][month][changelogId]
      return prev
    })
    setLoading(false)
  }

  const treeData: TreeNode[] = useMemo(() => {
    const treeData: TreeNode[] = Object.entries(data || []).map(
      ([year, months]) => {
        let yearTime = 0
        let yearAch = 0
        const yearChildren: TreeNode[] = Object.entries(months).map(
          ([month, changelogs]) => {
            let monthTime = 0
            let monthAch = 0
            const monthChildren: TreeNode[] = Object.entries(changelogs).map(
              ([id, changelog]) => {
                monthTime += changelog.hours
                monthAch += changelog.achievements
                return {
                  element: (
                    <ChangelogListItem
                      changelog={changelog}
                      onFinish={handleFinish}
                      onDelete={() => deleteChangelog(year, month, id)}
                    />
                  ),
                  key: id,
                }
              },
            )
            yearTime += monthTime
            yearAch += monthAch
            return {
              title: enUS.localize.month(Number(month.slice(1)) as Month),
              extra: <Extra ach={monthAch} time={monthTime} />,
              key: month,
              children: monthChildren,
            }
          },
        )
        return {
          title: year.slice(1),
          extra: (
            <Flex gap="small" align="center">
              <span>{yearAch}</span>
              <Icon path={mdiSeal} size="16px" />
              <Divider type="vertical" />
              <span>{formatPlayedTime(yearTime)}</span>
            </Flex>
          ),
          key: year,
          children: yearChildren,
        }
      },
    )
    if (isMore) {
      if (!treeData.length) {
        treeData.push(skeletonChangelogYearNode('loading-year', 2))
      } else {
        const child: NodeBranch = treeData.at(-1) as NodeBranch
        const grandChild: NodeBranch = child.children.at(-1) as NodeBranch
        grandChild?.children.push(
          {
            key: 'loading-1',
            element: (
              <InView as="div" onChange={(inView) => inView && fetchData()}>
                <SkeletonChangelogNodeLeaf />
              </InView>
            ),
          },
          {
            key: 'loading-2',
            element: <SkeletonChangelogNodeLeaf />,
          },
          {
            key: 'loading-3',
            element: <SkeletonChangelogNodeLeaf />,
          },
        )

        child.children!.push(skeletonChangelogMonthNode('loading-month', 4))

        treeData.push(skeletonChangelogYearNode('loading-year', 2))
      }
    }

    return treeData
  }, [data])

  return (
    <Flex vertical gap="middle">
      <Spin spinning={loading} fullscreen />
      <Tree treeData={treeData} />
    </Flex>
  )
}

export default Timeline
