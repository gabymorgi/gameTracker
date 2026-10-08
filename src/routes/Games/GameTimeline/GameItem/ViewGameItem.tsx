import { Flex } from 'antd'
import { useContext } from 'react'
import { FullHeightCard, GameImg } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { Tags } from '@/components/ui/Tags'
import { mdiPencilOutline } from '@mdi/js'
import { Icon } from '@/components/ui/Icon'
import { AuthContext } from '@/contexts/AuthContext'
import { formatPlayedTime } from '@/utils/format'
import styled from 'styled-components'
import { TrueProgress } from '@/components/ui/TrueProgress'
import { StateIcon } from '@/components/ui/StateIcon'
import { ChangelogWithGame } from '@/ts/api/changelogs'
import { StyledEditButton } from './StyledEditButton'

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
  z-index: 1;
`

interface Props {
  monthPlayedTime: number
  changelogGame: ChangelogWithGame
  onEdit: () => void
}

const ViewGameItem = (props: Props) => {
  const { isAuthenticated } = useContext(AuthContext)
  const { game } = props.changelogGame

  return (
    <FullHeightCard size="small">
      <StyledPercentage>
        {Math.round(
          (props.changelogGame.playedTime / props.monthPlayedTime) * 100,
        )}
        %
      </StyledPercentage>
      <ScoreRibbon mark={game.mark} review={game.review} iconColor="#333" />
      <Flex vertical gap="small" align="stretch" className="h-full relative">
        <div className="relative">
          <GameImg
            title={game.name || undefined}
            href={`https://steampowered.com/app/${game.appid}`}
            // width="250px"
            height="120px"
            className="object-cover self-align-center"
            src={game.imageUrl || ''}
            alt={`${game.name} header`}
            errorComponent={
              <a
                className="font-16"
                href={`https://steampowered.com/app/${game.appid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {game.name}
              </a>
            }
          />
          <StateIcon state={game.state} isFloating />
        </div>
        {isAuthenticated ? (
          <TrueProgress
            obtainedActual={props.changelogGame.playedTime}
            obtainedTotal={game.playedTime + (game.extraPlayedTime || 0)}
            total={game.playedTime + (game.extraPlayedTime || 0)}
            color="hsl(60 80% 30%)"
            formatLabel={formatPlayedTime}
          />
        ) : undefined}
        <div className="text-center">
          {game.totalAchievements ? (
            <TrueProgress
              obtainedActual={props.changelogGame.achievements}
              obtainedTotal={game.obtainedAchievements}
              total={game.totalAchievements}
            />
          ) : (
            'no data'
          )}
        </div>
        <Tags tags={game.tags} />
        {isAuthenticated ? (
          <StyledEditButton
            anchor="bottomRight"
            size="small"
            onClick={props.onEdit}
            icon={<Icon path={mdiPencilOutline} size="small" />}
          />
        ) : undefined}
      </Flex>
    </FullHeightCard>
  )
}

export default ViewGameItem
