import styled from 'styled-components'

export const JoinedInput = styled.div`
  display: flex;

  .input-left {
    border-right-width: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .divider {
    height: 26px;
    line-height: 26px;
    background: #141414;
    border-width: 1px 0px;
    border-style: solid;
    border-color: #424242;
  }

  .input-right {
    border-left-width: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`
