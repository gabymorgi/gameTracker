import { Button, Divider, Flex, Popconfirm } from 'antd'
import { useContext } from 'react'
import { FullHeightCard, GameImg } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { Tags } from '@/components/ui/Tags'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { formatPlayedTime } from '@/utils/format'
import { ChangelogWithGame } from '@/ts/api/changelogs'
import styled from 'styled-components'
import { TrueProgress } from '@/components/ui/TrueProgress'

const StyledPercentage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #141414;
  color: white;
  padding: 8px 6px 6px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  line-height: 1;
`

interface Props {
  monthPlayedTime: number
  changelogGame: ChangelogWithGame
  setSelectedGame: (changelogGame: ChangelogWithGame) => void
  delItem: (id: string) => void
}

function GameItem(props: Props) {
  const { isAuthenticated } = useContext(AuthContext)
  const { game } = props.changelogGame

  return (
    <FullHeightCard size="small">
      <StyledPercentage>
        {Math.round((props.changelogGame.hours / props.monthPlayedTime) * 100)}%
      </StyledPercentage>
      <ScoreRibbon mark={game.mark} review={game.review} />
      <Flex vertical gap="small" align="stretch" className="h-full">
        <GameImg
          title={game.name || undefined}
          href={`https://steampowered.com/app/${game.appid}`}
          width="250px"
          height="120px"
          className="object-cover self-align-center"
          src={game.imageUrl || ''}
          alt={`${game.name} header`}
          $errorComponent={<span className="font-16">{game.name}</span>}
        />
        {isAuthenticated ? (
          <Flex justify="space-between" align="center" className="text-center">
            <span>{formatPlayedTime(props.changelogGame.hours)}</span>
            <Divider vertical />
            <span>of</span>
            <Divider vertical />
            <span>
              {formatPlayedTime(game.playedTime + (game.extraPlayedTime || 0))}
            </span>
          </Flex>
        ) : undefined}
        <div className="text-center">
          {game.achievements.total ? (
            <TrueProgress
              obtainedActual={props.changelogGame.achievements}
              obtainedTotal={game.achievements.obtained}
              total={game.achievements.total}
            />
          ) : (
            'no data'
          )}
        </div>
        <Tags tags={game.tags} />
        {isAuthenticated ? (
          <Flex gap="small" id="actions" className="self-align-end mt-auto">
            <Button
              onClick={() => props.setSelectedGame(props.changelogGame)}
              icon={<EditFilled />}
            />
            <Popconfirm
              title="Are you sure you want to delete this game?"
              onConfirm={() => props.delItem(game.id)}
              icon={<DeleteFilled />}
            >
              <Button danger icon={<DeleteFilled />} />
            </Popconfirm>
          </Flex>
        ) : undefined}
      </Flex>
    </FullHeightCard>
  )
}

export default GameItem
