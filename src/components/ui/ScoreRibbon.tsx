import { mdiTrophyAward } from '@mdi/js'
import Icon from '@mdi/react'
import { Popover } from 'antd'
import styled, { css } from 'styled-components'

interface RibbonProps {
  color: string
  $pointer?: boolean
  $position: 'left' | 'right'
}

const RightRibbon = styled.div<RibbonProps>`
  display: flex;
  align-items: center;
  position: absolute;
  top: 6px;
  border-end-end-radius: 0;
  background: ${(props) => props.color};
  color: white;
  ${(props) =>
    props.$position === 'left'
      ? css`
          inset-inline-start: -8px;
          padding: 0px 10px 0px 20px;
          box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.75);
        `
      : css`
          inset-inline-end: -8px;
          padding: 0px 20px 0px 10px;
          box-shadow: -3px 3px 6px 0px rgba(0, 0, 0, 0.75);
        `}
  z-index: 1;
  font-size: 18px;
  font-weight: bold;
  border-radius: 3px;
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
    ${(props) =>
      props.$position === 'left'
        ? css`
            inset-inline-start: 0;
            border-block-end-color: transparent;
            border-inline-start-color: transparent;
          `
        : css`
            inset-inline-end: 0;
            border-inline-end-color: transparent;
            border-block-end-color: transparent;
          `}
  }
`

interface ScoreRibbonProps {
  mark: number
  review?: string
  position?: 'left' | 'right'
}

export const ScoreRibbon: React.FC<ScoreRibbonProps> = (props) => {
  if (props.mark < 0) return null

  return (
    <Popover
      placement="bottomRight"
      content={<span className="pre-wrap">{props.review}</span>}
      trigger="click"
      arrow={false}
    >
      <RightRibbon
        color={`hsl(${props.mark * 18}, 100%, 25%)`}
        $pointer={Boolean(props.review)}
        $position={props.position || 'right'}
      >
        <Icon path={mdiTrophyAward} size="20px" /> {props.mark}
      </RightRibbon>
    </Popover>
  )
}
