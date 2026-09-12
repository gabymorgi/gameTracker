import { $Enums } from '#prisma-generated-client'
import {
  mdiBookOpenBlankVariantOutline,
  mdiBookshelf,
  mdiCancel,
  mdiController,
  mdiCrown,
  mdiMedal,
  mdiSnowflake,
  mdiTrophyVariant,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import styled from 'styled-components'

type State = $Enums.GameState | $Enums.BookState

interface StateIconProps {
  state: State
}

const StateIconCircle = styled.div<{ $color: string }>`
  position: absolute;
  bottom: 0;
  inset-inline-start: 0%;
  transform: translate(-20%, 0%);
  width: 24px;
  height: 24px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color};
  color: 'white';
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.75);
  z-index: 1;
`

const stateConfig: Record<State, { color: string; icon: string }> = {
  PLAYING: { color: 'hsl(60, 100%, 35%)', icon: mdiController },
  READING: {
    color: 'hsl(141, 70%, 45%)',
    icon: mdiBookOpenBlankVariantOutline,
  },
  WON: { color: 'hsl(140, 68%, 32%)', icon: mdiCrown },
  FINISHED: { color: 'hsl(230, 93%, 45%)', icon: mdiCrown },
  COMPLETED: { color: 'hsl(230, 93%, 45%)', icon: mdiMedal },
  ACHIEVEMENTS: { color: 'hsl(198, 93%, 45%)', icon: mdiTrophyVariant },
  DROPPED: { color: 'hsl(0, 90%, 35%)', icon: mdiSnowflake },
  BANNED: { color: 'hsl(0, 0%, 0%)', icon: mdiCancel },
  WANT_TO_READ: { color: 'hsl(300, 92%, 40%)', icon: mdiBookshelf },
}

export function StateIcon(props: StateIconProps) {
  const config = stateConfig[props.state]

  if (!config) return null

  return (
    <StateIconCircle
      $color={config.color}
      aria-label={props.state}
      title={props.state}
    >
      <Icon path={config.icon} size="1rem" />
    </StateIconCircle>
  )
}
