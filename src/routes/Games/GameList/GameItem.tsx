import { Button, Divider, Flex, Popconfirm, Progress } from 'antd'
import { useContext } from 'react'
import { FullHeightCard, GameImg } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { Tags } from '@/components/ui/Tags'
import { State } from '@/components/ui/State'
import { format } from 'date-fns'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { formatPlayedTime } from '@/utils/format'
import { Game } from '@prisma/client'

const stateTemplates = {
  Banned: 0,
  Playing: 58,
  Won: 150,
  Achievements: 194,
  Completed: 228,
  Dropped: 311,
}

interface Props {
  game: Game
  setSelectedGame: (game: Game) => void
  delItem: (id: string) => void
}

function GameItem(props: Props) {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <FullHeightCard size="small">
      <ScoreRibbon mark={props.game.mark} review={props.game.review} />
      <Flex vertical gap="small" align="stretch" className="h-full">
        <GameImg
          title={props.game.name || undefined}
          href={`https://steampowered.com/app/${props.game.appid}`}
          width="250px"
          height="120px"
          className="object-cover self-align-center"
          src={props.game.imageUrl || ''}
          alt={`${props.game.name} header`}
          $errorComponent={<span className="font-16">{props.game.name}</span>}
        />
        <Flex justify="space-between" align="center" className="text-center">
          <span>
            {props.game.start
              ? format(new Date(props.game.start), 'dd MMM yyyy')
              : 'no data'}
          </span>
          <Divider type="vertical" />
          <span>
            {formatPlayedTime(
              props.game.playedTime + (props.game.extraPlayedTime || 0),
            )}
          </span>
          <Divider type="vertical" />
          <span>
            {props.game.end
              ? format(new Date(props.game.end), 'dd MMM yyyy')
              : 'no data'}
          </span>
        </Flex>
        <State state={props.game.stateId || undefined} />
        <div className="text-center">
          {props.game.achievements.total ? (
            <Progress
              format={() =>
                `${props.game.achievements.obtained} / ${props.game.achievements.total}`
              }
              percent={
                (props.game.achievements.obtained /
                  props.game.achievements.total) *
                100
              }
              percentPosition={{ align: 'center', type: 'inner' }}
              size={{
                height: 20,
              }}
              strokeColor="hsl(180, 80%, 30%)"
            />
          ) : (
            'no data'
          )}
        </div>
        <Tags tags={props.game.tags} />
        {isAuthenticated ? (
          <Flex gap="small" id="actions" className="self-align-end mt-auto">
            <Button onClick={() => setSelectedGame(g)} icon={<EditFilled />} />
            <Popconfirm
              title="Are you sure you want to delete this game?"
              onConfirm={() => delItem(props.game.id)}
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
