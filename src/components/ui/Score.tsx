import { mdiTrophyAward } from '@mdi/js'
import Icon from '@mdi/react'
import { Popover } from 'antd'
import styled from 'styled-components'

const StyledScoreRibbon = styled.div<{ color: string; $pointer?: boolean }>`
  display: flex;
  align-items: center;
  position: absolute;
  top: 6px;
  inset-inline-end: -8px;
  border-end-end-radius: 0;
  background: ${(props) => props.color};
  color: white;
  padding: 0px 20px 0px 10px;
  z-index: 1;
  font-size: 18px;
  font-weight: bold;
  border-radius: 3px;
  box-shadow: -3px 3px 6px 0px rgba(0, 0, 0, 0.75);
  cursor: ${(props) => (props.$pointer ? 'pointer' : 'default')};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    color: ${(props) => props.color};
    border: 4px solid;
    transform: scaleY(0.75);
    transform-origin: top;
    filter: brightness(75%);
    inset-inline-end: 0;
    border-inline-end-color: transparent;
    border-block-end-color: transparent;
  }
`

export const ScoreRibbon: React.FC<{ mark: number; review?: string }> = (
  props,
) => {
  if (props.mark < 0) return null

  return (
    <Popover
      placement="bottomRight"
      content={props.review}
      trigger="click"
      arrow={false}
    >
      <StyledScoreRibbon
        color={`hsl(${props.mark * 18}, 100%, 25%)`}
        $pointer={Boolean(props.review)}
      >
        <Icon path={mdiTrophyAward} size="20px" /> {props.mark}
      </StyledScoreRibbon>
    </Popover>
  )
}
