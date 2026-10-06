import { Button, Listy } from 'antd'
import ChangelogListItem from './ChangelogListItem'
import { ReactElement, useMemo, useState } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import ChangelogItemInput from './ChangelogItemInput'
import { Changelog as PrismaChangelog } from '#prisma-browser-client'
import { GameWithChangelogs } from '@/ts/api/games'
import GameInfo from './GameInfo'
import { FullHeightCard } from '@/styles/TableStyles'

const FloatingButton = styled(Button)`
  position: absolute;
  bottom: -12px;
  border-radius: 50%;
  right: 50%;
  transform: translate(50%, 0);
`

const StyledListy = styled(Listy<ReactElement>)`
  max-height: 194px;
  overflow: auto;
`

interface GameChangelogCardI {
  gameChangelog: GameWithChangelogs
  onFinish: (values: PrismaChangelog, id?: string, gameId?: string) => void
  onDelete: (id: string, gameId: string) => void
  onEdit: (game: GameWithChangelogs) => void
  onMerge: (
    changelog: PrismaChangelog,
    prevChangelog: PrismaChangelog,
    gameId: string,
  ) => void
}

const GameChangelogCard = (props: GameChangelogCardI) => {
  const [isAdding, setAdding] = useState(false)

  const dataSource = useMemo(() => {
    const ds = props.gameChangelog.changelogs.map((changelog, i, a) => (
      <ChangelogListItem
        key={changelog.id}
        changelog={changelog}
        isFirst={i === 0}
        isLast={i === a.length - 1}
        onDelete={() => props.onDelete(changelog.id, props.gameChangelog.id)}
        onFinish={(values) =>
          props.onFinish(values, changelog.id, props.gameChangelog.id)
        }
        onMergeUp={() =>
          props.onMerge(changelog, a[i - 1], props.gameChangelog.id)
        }
        onMergeDown={() =>
          props.onMerge(changelog, a[i + 1], props.gameChangelog.id)
        }
      />
    ))
    if (isAdding) {
      ds.push(
        <ChangelogItemInput
          key="add"
          onFinish={(v) => {
            props.onFinish({
              ...v,
              gameId: props.gameChangelog.id,
            })
            setAdding(false)
          }}
          onCancel={() => setAdding(false)}
          changelog={{
            id: '',
            gameId: props.gameChangelog.id,
            createdAt: new Date(),
            achievements: 0,
            state: 'PLAYING',
            playedTime: 0,
          }}
        />,
      )
    }
    return ds
  }, [props, isAdding])

  return (
    <FullHeightCard
      size="small"
      title={
        <GameInfo
          game={props.gameChangelog}
          onEdit={() => props.onEdit(props.gameChangelog)}
        />
      }
    >
      <div className="relative">
        <StyledListy
          rowKey={(item) => item.key ?? ''}
          items={dataSource}
          itemRender={(item) => item}
        />
        {!isAdding && (
          <FloatingButton
            key="add-button"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setAdding(true)}
          />
        )}
      </div>
    </FullHeightCard>
  )
}

export default GameChangelogCard
