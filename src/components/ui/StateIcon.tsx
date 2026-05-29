import { BookState } from '@/ts/api/books'
import { GameState } from '@/ts/api/games'
import {
  mdiBookmark,
  mdiController,
  mdiSnowflake,
  mdiStarCircle,
  mdiTrophyVariant,
  mdiTrophyVariantOutline,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import styled from 'styled-components'

type State = GameState | BookState

interface StateIconProps {
  state: State
}

const StateIconCircle = styled.div<{ $color: string; $state: State }>`
  position: absolute;
  bottom: 0;
  inset-inline-start: 0%;
  transform: translate(-20%, 0%);
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color};
  color: ${(props) => (props.$state === 'ACHIEVEMENTS' ? 'white' : 'white')};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.75);
  z-index: 1;
`

const stateConfig: Record<State, { color: string; icon: string }> = {
  PLAYING: { color: 'hsl(141, 70%, 45%)', icon: mdiController },
  READING: { color: 'hsl(141, 70%, 45%)', icon: mdiController },
  WON: { color: 'hsl(230, 93%, 45%)', icon: mdiStarCircle },
  FINISHED: { color: 'hsl(230, 93%, 45%)', icon: mdiStarCircle },
  COMPLETED: { color: 'hsl(198, 93%, 45%)', icon: mdiTrophyVariantOutline },
  ACHIEVEMENTS: { color: 'hsl(212, 26%, 65%)', icon: mdiTrophyVariant },
  DROPPED: { color: 'hsl(0, 90%, 35%)', icon: mdiSnowflake },
  BANNED: { color: 'hsl(0, 90%, 50%)', icon: mdiSnowflake },
  WANT_TO_READ: { color: 'hsl(300, 92%, 40%)', icon: mdiBookmark },
}

export function StateIcon(props: StateIconProps) {
  const config = stateConfig[props.state]

  if (!config) return null

  return (
    <StateIconCircle
      $color={config.color}
      $state={props.state}
      aria-label={props.state}
      title={props.state}
    >
      <Icon path={config.icon} size="1rem" />
    </StateIconCircle>
  )
}
