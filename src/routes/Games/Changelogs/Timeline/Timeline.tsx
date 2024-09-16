import { Divider, Flex } from 'antd'
import { useEffect, useMemo } from 'react'
import { usePaginatedFetch } from '@/hooks/useFetch'
import { InView } from 'react-intersection-observer'
import useGameFilters from '@/hooks/useGameFilters'
import { formatPlayedTime } from '@/utils/format'
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
import { Changelog } from '@/ts/api/changelogs'

type TreeChangelog = Record<string, Record<string, Record<string, Changelog>>>

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
  const { data, nextPage, isMore, reset, deleteValue, updateValue } =
    usePaginatedFetch('changelogs')

  useEffect(() => {
    reset({
      from: new Date('2023-04-01'),
      to: new Date('2023-06-30'),
    })
  }, [queryParams])

  const handleFinish = async (values: Changelog) => {
    // if (!id) {
    //   addValue(values)
    // } else {
    updateValue(values)
    // }
  }

  const treeData: TreeNode[] = useMemo(() => {
    const newDataTree: TreeChangelog = {}
    for (const changelog of data) {
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
    const treeData: TreeNode[] = Object.entries(newDataTree || []).map(
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
                      onDelete={() => deleteValue(id)}
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
              <InView as="div" onChange={(inView) => inView && nextPage()}>
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
      <Tree treeData={treeData} />
    </Flex>
  )
}

export default Timeline
