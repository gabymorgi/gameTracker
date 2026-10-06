import { Button, Flex, Typography } from 'antd'
import Img from '@/components/ui/Img'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { StateIcon } from '@/components/ui/StateIcon'
import { Tag, Tags } from '@/components/ui/Tags'
import { formatPlayedTime, formattedDate } from '@/utils/format'
import { platformHues } from '@/utils/color'
import { GameWithChangelogs } from '@/ts/api/games'
import { Icon } from '@mdi/react'
import { mdiMusicCircle } from '@mdi/js'
import styled from 'styled-components'
import { EditFilled } from '@ant-design/icons'

const StyledFlex = styled(Flex)`
  padding: 8px 0px;
`

export const StyledEditButton = styled(Button)`
  position: absolute;
  bottom: 8px;
  right: 0px;
`

interface GameInfoProps {
  game: GameWithChangelogs
  onEdit: () => void
}

const GameInfo = ({ game, onEdit }: GameInfoProps) => {
  const changelogAchievements = game.changelogs.reduce(
    (total, changelog) => total + changelog.achievements,
    0,
  )
  const changelogPlayedTime = game.changelogs.reduce(
    (total, changelog) => total + changelog.playedTime,
    0,
  )
  const timeDiscrepancy =
    game.playedTime + (game.extraPlayedTime || 0) - changelogPlayedTime
  const achievementDiscrepancy =
    game.obtainedAchievements - changelogAchievements

  return (
    <>
      <ScoreRibbon mark={game.mark} review={game.review} />
      <StyledFlex
        gap="middle"
        justify="space-between"
        align="center"
        className="relative"
      >
        <Img
          height={130}
          src={game.imageUrl || ''}
          alt={`${game.name} header`}
          href={
            game.appid ? `https://steampowered.com/app/${game.appid}` : null
          }
          errorComponent={<span className="font-16">{game.name}</span>}
        />
        <Flex vertical align="left" gap="small" style={{ flex: 1 }}>
          <Flex gap="small" align="left">
            <Tag size="small" gap="small" $hue={platformHues[game.platform]}>
              {game.platform}
            </Tag>
            <StateIcon state={game.state} />
            {game.ost && (
              <a href={game.ost} target="_blank" rel="noopener noreferrer">
                <Icon path={mdiMusicCircle} size="24px" />
              </a>
            )}
            {game.obtainedAchievements} / {game.totalAchievements}
          </Flex>
          <h2 className="text-ellipsis" title={game.name}>
            {game.name}
          </h2>
          <Flex gap="small" align="left">
            <span>{formatPlayedTime(changelogPlayedTime)}</span>|
            <span>
              {formattedDate(game.start)} - {formattedDate(game.end)}
            </span>
          </Flex>
          <Tags tags={game.tags} />
          {achievementDiscrepancy !== 0 && (
            <Typography.Text type="danger">
              {achievementDiscrepancy > 0
                ? `${achievementDiscrepancy} achievements untracked`
                : `${achievementDiscrepancy} achievements to be removed`}
            </Typography.Text>
          )}
          {timeDiscrepancy !== 0 && (
            <Typography.Text type="danger">
              {timeDiscrepancy > 0
                ? `${formatPlayedTime(timeDiscrepancy)} minutes untracked`
                : `${formatPlayedTime(-timeDiscrepancy)} minutes to be removed`}
            </Typography.Text>
          )}
        </Flex>
        <StyledEditButton
          size="medium"
          onClick={onEdit}
          icon={<EditFilled />}
        />
      </StyledFlex>
    </>
  )
}

export default GameInfo
