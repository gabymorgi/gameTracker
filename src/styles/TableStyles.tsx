import styled from 'styled-components'
import colorPalette from './variables'

export const TableContainer = styled.div`
  && {
    .ant-table {
      border: 1px solid ${colorPalette.cardBorder};
    }
    .ant-table-thead > tr > th {
      background-color: #222;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .ant-table-tbody > tr {
      background: #080808;
      &:not(.ant-table-placeholder):nth-child(2n + 1) {
        background: #111;
      }
      > td {
        border: none;
        /* background-color: unset; */
      }
    }
  }
`
