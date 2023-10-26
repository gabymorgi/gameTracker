import React from 'react'
import styled, { css } from 'styled-components'
import { GlobalContext } from '@/contexts/GlobalContext'

export const Background = styled.div<{ $hue?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  ${(props) => css`
    color: ${props.$hue !== undefined
      ? `hsl(${props.$hue}, 100%, 70%)`
      : '#808080'};
    border: 2px solid
      ${props.$hue !== undefined ? `hsl(${props.$hue}, 100%, 70%)` : '#808080'};
    background: ${props.$hue !== undefined
      ? `hsl(${props.$hue}, 100%, 15%)`
      : '#808080'};
    font-weight: bolder;
  `}
  border-radius: 20px;
  padding: 4px 8px;
`

export const State: React.FC<{ state?: string }> = (props) => {
  const { states: stateTemplates } = React.useContext(GlobalContext)
  return props.state ? (
    <Background $hue={stateTemplates?.[props.state]}>{props.state}</Background>
  ) : (
    <Background $hue={0}>State not found</Background>
  )
}
