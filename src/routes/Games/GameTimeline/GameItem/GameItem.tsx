import { useState } from 'react'
import styled from 'styled-components'
import { ChangelogWithGame } from '@/ts/api/changelogs'
import { Game } from '@/ts/api/games'
import ViewGameItem from './ViewGameItem'
import EditGameItem from './EditGameItem'

const FlipContainer = styled.div<{ $flipped: boolean }>`
  display: grid;
  height: 100%;
  perspective: 1000px;

  .flip-inner {
    display: grid;
    grid-area: 1 / 1;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    transform: rotateY(${({ $flipped }) => ($flipped ? '180deg' : '0')});
  }

  .flip-face {
    grid-area: 1 / 1;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .flip-back {
    transform: rotateY(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .flip-inner {
      transition: none;
    }
  }
`

interface Props {
  monthPlayedTime: number
  changelogGame: ChangelogWithGame
  onGameUpdate: (changelogId: string, game: Game) => void
}

const GameItem = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  function handleSaved(updatedGame: Game) {
    props.onGameUpdate(props.changelogGame.id, updatedGame)
    setIsEditing(false)
  }

  return (
    <FlipContainer $flipped={isEditing}>
      <div className="flip-inner">
        <div className="flip-face" inert={isEditing}>
          <ViewGameItem
            monthPlayedTime={props.monthPlayedTime}
            changelogGame={props.changelogGame}
            onEdit={() => setIsEditing(true)}
          />
        </div>
        <div className="flip-face flip-back" inert={!isEditing}>
          <EditGameItem
            game={props.changelogGame.game}
            active={isEditing}
            onClose={() => setIsEditing(false)}
            onSaved={handleSaved}
          />
        </div>
      </div>
    </FlipContainer>
  )
}

export default GameItem
