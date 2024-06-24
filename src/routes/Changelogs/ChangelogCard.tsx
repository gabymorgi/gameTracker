import { List, Typography } from 'antd'
import { GameChangelogI } from '@/ts'
import Img from '@/components/ui/Img'
import ChangelogItem from './ChangelogItem'
import { useMemo } from 'react'
import { formatPlayedTime } from '@/utils/format'

interface ChangelogCardI {
  gameChangelog: GameChangelogI
  onFinish: (
    values: GameChangelogI['changeLogs'][number],
    id: string,
    gameId: string,
  ) => void
  onDelete: (id: string, gameId: string) => void
  onMerge: (
    changeLog: GameChangelogI['changeLogs'][number],
    prevChangeLog: GameChangelogI['changeLogs'][number],
    gameId: string,
  ) => void
}

const ChangelogCard = (props: ChangelogCardI) => {
  const achievementDiscrepancy = useMemo(() => {
    const achievements: number = props.gameChangelog.changeLogs.reduce(
      (acum, c) => acum + c.achievements,
      0,
    )
    const diff = props.gameChangelog.obtainedAchievements - achievements
    if (diff > 0) return `${Math.abs(diff)} achievements untracked`
    if (diff < 0) return `${diff} achievements to be removed`
  }, [props.gameChangelog])

  const timeDiscrepancy = useMemo(() => {
    const time: number = props.gameChangelog.changeLogs.reduce(
      (acum, c) => acum + c.hours,
      0,
    )
    const diff =
      props.gameChangelog.playedTime +
      Number(props.gameChangelog.extraPlayedTime) -
      time
    if (diff > 0) return `${formatPlayedTime(Math.abs(diff))} minutes untracked`
    if (diff < 0) return `${formatPlayedTime(diff)} minutes to be removed`
  }, [props.gameChangelog])

  return (
    <List
      size="small"
      header={
        <div className="flex items-center justify-between gap-16">
          <Img
            height={75}
            src={props.gameChangelog.imageUrl || ''}
            alt={`${props.gameChangelog.name} header`}
            $errorComponent={
              <span className="font-16">{props.gameChangelog.name}</span>
            }
          />
          <div className="flex flex-col items-end">
            <h2>{props.gameChangelog.name}</h2>
            {achievementDiscrepancy && (
              <Typography.Text type="danger">
                {achievementDiscrepancy}
              </Typography.Text>
            )}
            {timeDiscrepancy && (
              <Typography.Text type="danger">{timeDiscrepancy}</Typography.Text>
            )}
          </div>
        </div>
      }
      bordered
      dataSource={props.gameChangelog.changeLogs.map((changeLog, i, a) => (
        <ChangelogItem
          key={changeLog.id}
          changelog={changeLog}
          isFirst={i === 0}
          isLast={i === a.length - 1}
          onDelete={() => props.onDelete(changeLog.id, props.gameChangelog.id)}
          onFinish={(values) =>
            props.onFinish(values, changeLog.id, props.gameChangelog.id)
          }
          onMergeUp={() =>
            props.onMerge(changeLog, a[i - 1], props.gameChangelog.id)
          }
          onMergeDown={() =>
            props.onMerge(changeLog, a[i + 1], props.gameChangelog.id)
          }
        />
      ))}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  )
}

export default ChangelogCard
