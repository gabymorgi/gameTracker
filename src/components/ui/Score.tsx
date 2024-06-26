import { Tooltip } from 'antd'
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
    > * {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      svg {
        width: 21px !important;
        height: unset !important;
      }
    }
  }
`

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

const StyledScore = styled.div`
  display: flex;
`

const StyledScoreBar = styled.div<{ $value?: number | null }>`
  width: 25px;
  text-align: center;
  font-weight: bold;
  color: white;
  border-radius: 4px;
  ${(props) => {
    if (props.$value) {
      const color = 12 * props.$value
      return `
        background: ${`hsl(${color}, 100%, 30%)`};
        border: 1px solid ${`hsl(${color}, 100%, 40%)`};
      `
    }
  }}
`

export const Score: React.FC<{ score?: ScoreI | null }> = (props) => {
  if (!props.score) {
    return (
      <StyledScore>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
        <StyledScoreBar>-</StyledScoreBar>
      </StyledScore>
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
    <StyledScore>
      <StyledScoreBar $value={props.score.content}>
        {props.score.content || '-'}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.lore}>
        {props.score.lore || '-'}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.mechanics}>
        {props.score.mechanics || '-'}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.bosses}>
        {props.score.bosses || '-'}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.controls}>
        {props.score.controls || '-'}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.music}>
        {props.score.music || '-'}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.graphics}>
        {props.score.graphics || '-'}
      </StyledScoreBar>
      <StyledScoreBar>
        {props.score.extras.length ? (
          <Tooltip title={extraTooltip}>
            {extraBias > 0 ? '⟰' : extraBias < 0 ? '⟱' : '⨌'}
          </Tooltip>
        ) : undefined}
      </StyledScoreBar>
      <StyledScoreBar $value={props.score.finalMark}>
        {props.score.finalMark || '-'}
      </StyledScoreBar>
    </StyledScore>
  )
}
