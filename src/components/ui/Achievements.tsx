import React from 'react';
import styled from 'styled-components'

const Background = styled.div<{ obtained: number; total: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  position: relative;
  background: #600060;
  width: 100%;
  border-radius: 4px;
  padding: 4px 12px;

  &:after {
    content: ' ';
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 4px;
    position: absolute;
    background: #006060;
    width: ${(props) => (props.obtained / props.total) * 100}%;
  }

  > * {
    z-index: 1;
  }
`

export const Achievements: React.FC<{ achievements: [number, number] }> = (props) => {
  return (
    <Background obtained={props.achievements[0]} total={props.achievements[1]}>
      <div>
        {props.achievements[0]} / {props.achievements[1]}
      </div>
    </Background>
  )
}
