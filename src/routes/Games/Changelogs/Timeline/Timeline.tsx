import { Button, Card, Col, Divider, Empty, Flex, Modal, Row } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { usePaginatedFetch } from '@/hooks/useFetch'
import { InView } from 'react-intersection-observer'
import { formatPlayedTime } from '@/utils/format'
import { format } from 'date-fns'
import Icon from '@mdi/react'
import { mdiClock, mdiSeal } from '@mdi/js'
import {
  SkeletonChangelogItem,
  SkeletonChangelogList,
} from '@/components/skeletons/SkeletonChangelogNode'
import {
  ChangelogsGetGamesParams,
  ChangelogWithGame,
} from '@/ts/api/changelogs'
import { ChangelogFilters } from '@/components/Filters/ChangelogFilters'
import useChangelogFilters from '@/hooks/useChangelogFilters'
import ChangelogItem from './ChangelogItem'
import RecentlyPlayed from '../../RecentlyPlayed/RecentlyPlayed'
import { ChartComponent } from '../../GameList/Chart'

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

const Timeline = () => {
  const { queryParams } = useChangelogFilters()
  const { data, nextPage, isMore, reset, deleteValue, updateValue } =
    usePaginatedFetch('changelogs')
  const [recentlyPlayedOpen, setRecentlyPlayedOpen] = useState(false)
  useEffect(() => {
    reset(queryParams as ChangelogsGetGamesParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

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

  const handleClose = () => {
    setRecentlyPlayedOpen(false)
    reset(queryParams as ChangelogsGetGamesParams)
  }

  return (
    <Flex vertical gap="middle">
      <Button onClick={() => setRecentlyPlayedOpen(true)}>
        Recently Played
      </Button>
      <ChartComponent />
      <ChangelogFilters />
      <Flex vertical gap="middle">
        {treeData?.map((tData, i) => {
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
                    <ChangelogItem
                      monthPlayedTime={tData.time}
                      changelogGame={changelog}
                      delItem={deleteValue}
                      setSelectedGame={() => {}}
                    />
                  </Col>
                ))}
                {isMore && i === treeData.length - 1 ? (
                  <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key="in-view">
                    <InView
                      as="div"
                      onChange={(inView) => inView && nextPage()}
                    >
                      <SkeletonChangelogItem />
                    </InView>
                  </Col>
                ) : undefined}
              </Row>
            </Card>
          )
        })}
        {isMore ? (
          <>
            <SkeletonChangelogList amount={8} />
            <SkeletonChangelogList amount={12} />
          </>
        ) : !data?.length ? (
          <Empty />
        ) : undefined}
      </Flex>
      <Modal title="Update Game" open={!!recentlyPlayedOpen}>
        <RecentlyPlayed onClose={handleClose} />
      </Modal>
    </Flex>
  )
}

export default Timeline
