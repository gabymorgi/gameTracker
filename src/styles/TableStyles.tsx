import styled from 'styled-components'
import { Flex } from 'antd'

export const TableContainer = styled(Flex)`
  && {
    .card {
      border: 1px solid #303030;
      color: rgba(255, 255, 255, 0.85);
      background: #141414;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 16px;

      flex-direction: column;
      height: 100%;
      > * {
        width: 100%;
        max-width: 300px;
        text-align: center;
      }
      #tags {
        > * {
          justify-content: center;
        }
      }
      #date {
        display: flex;
        justify-content: space-between;
      }
      #score {
        margin-top: auto;
        label > div {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        & > div {
          justify-content: center;
        }
      }
      #actions {
        justify-content: end;
      }
    }
  }
`
