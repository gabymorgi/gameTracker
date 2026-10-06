import { Button } from 'antd'
import styled, { css } from 'styled-components'

export const StyledEditButton = styled(Button)<{
  anchor?: 'bottomRight' | 'topLeft'
}>`
  position: absolute;
  ${({ anchor }) => {
    switch (anchor) {
      case 'topLeft':
        return css`
          top: -1px;
          left: -1px;
        `
      case 'bottomRight':
      default:
        return css`
          bottom: -13px;
          right: -13px;
        `
    }
  }}
`
