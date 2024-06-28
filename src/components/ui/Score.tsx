import { Progress, Tooltip, ProgressProps, Flex } from 'antd'
import styled from 'styled-components'
import Icon from '@mdi/react'
import {
  mdiCup,
  mdiBookOpenPageVariant,
  mdiChemicalWeapon,
  mdiRobotAngry,
  mdiController,
  mdiInstagram,
  mdiMusicClefTreble,
  mdiOneUp,
  mdiSchool,
} from '@mdi/js'
import React from 'react'
import { ScoreI } from '@/ts/game'
import { Bias } from './Bias'

const StyledScoreHeader = styled.div`
  .title {
    font-weight: bold;
  }
  .group > * {
    text-transform: uppercase;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  .group {
    display: flex;
    gap: 2px;
    > * {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      svg {
        width: 21px !important;
        height: unset !important;
      }
    }
  }
`

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#ff1500',
  '50%': '#fffb00',
  '100%': '#4dff00',
}

const scoreFields = [
  { name: 'content', icon: mdiCup },
  { name: 'lore', icon: mdiBookOpenPageVariant },
  { name: 'mechanics', icon: mdiChemicalWeapon },
  { name: 'bosses', icon: mdiRobotAngry },
  { name: 'controls', icon: mdiController },
  { name: 'music', icon: mdiMusicClefTreble },
  { name: 'graphics', icon: mdiInstagram },
  { name: 'extra', icon: mdiOneUp },
  { name: 'total', icon: mdiSchool },
]

const color = 'rgba(255, 255, 255, 0.85)'

export const ScoreHeader: React.FC = () => {
  return (
    <StyledScoreHeader>
      <div className="title">Score</div>
      <div className="group">
        {scoreFields.map((f) => (
          <div key={f.name}>
            <Icon path={f.icon} title={f.name} size={1} color={color} />
          </div>
        ))}
      </div>
    </StyledScoreHeader>
  )
}

function ProgressScore(props: { score?: number }) {
  return (
    <Progress
      percent={(props.score || 0) * 10}
      strokeColor={conicColors}
      trailColor="transparent"
      size={24}
      format={() => props.score || '-'}
      type="dashboard"
    />
  )
}

const StyledScoreBar = styled.div`
  width: 24px;
  text-align: center;
  font-weight: bold;
  color: white;
`

export const Score: React.FC<{ score?: ScoreI | null }> = (props) => {
  if (!props.score) {
    return (
      <Flex gap={2}>
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
        <ProgressScore />
      </Flex>
    )
  }
  const extraTooltip = props.score.extras.map((e, i) => (
    <div key={i}>
      <Bias value={e.bias} /> {e.info}
    </div>
  ))
  const extraBias =
    props.score.extras.reduce((acum, e) => acum + e.bias, 0) || 0

  return (
    <Flex gap={2}>
      <ProgressScore score={props.score.content} />
      <ProgressScore score={props.score.lore} />
      <ProgressScore score={props.score.mechanics} />
      <ProgressScore score={props.score.bosses} />
      <ProgressScore score={props.score.controls} />
      <ProgressScore score={props.score.music} />
      <ProgressScore score={props.score.graphics} />
      <StyledScoreBar>
        {props.score.extras.length ? (
          <Tooltip title={extraTooltip}>
            {extraBias > 0 ? '⟰' : extraBias < 0 ? '⟱' : '⨌'}
          </Tooltip>
        ) : undefined}
      </StyledScoreBar>
      <ProgressScore score={props.score.finalMark} />
    </Flex>
  )
}
