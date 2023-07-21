import { DislikeFilled, InfoCircleFilled, LikeFilled } from '@ant-design/icons'
import styled, { css } from 'styled-components'

const StyledBias = styled.div<{ value: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${(props) => {
    if (props.value > 0) {
      return css`
        background-color: rgba(0, 255, 0, 0.1);
        color: rgba(0, 255, 0);
      `
    } else if (props.value < 0) {
      return css`
        background-color: rgba(255, 0, 0, 0.1);
        color: rgba(255, 0, 0);
      `
    }
    return css`
      background-color: rgba(0, 255, 255, 0.1);
      color: rgba(0, 255, 255);
    `
  }};
`

export function Bias(props: { value: number }) {
  return (
    <StyledBias value={Number(props.value)}>
      {Number(props.value) > 0 ? (
        <LikeFilled />
      ) : Number(props.value) < 0 ? (
        <DislikeFilled />
      ) : (
        <InfoCircleFilled />
      )}
    </StyledBias>
  )
}
