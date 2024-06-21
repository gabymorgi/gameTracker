import styled from 'styled-components'
import { isDesktop, isTablet } from './Resolutions'

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  && {
    #header {
      position: sticky;
      top: 0;
      z-index: 100;
      @media (${isTablet}) {
        display: none;
      }
    }
    .card {
      border: 1px solid #303030;
      color: rgba(255, 255, 255, 0.85);
      background: #141414;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
      @media (${isDesktop}) {
        justify-content: space-between;
        > * {
          text-align: center;
          flex-shrink: 0;
        }
        #name {
          width: 200px;
        }
        #date {
          width: 120px;
        }
        #hours {
          width: 132px;
        }
        #state {
          width: 165px;
        }
        #achievements {
          width: 200px;
        }
        #tags {
          flex-grow: 1;
          flex-shrink: 1;
          > * {
            justify-content: center;
          }
        }
        #score {
          width: 225px;
          label {
            display: none;
          }
        }
        #actions {
          width: 80px;
          justify-content: center;
        }
      }
      @media (${isTablet}) {
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
  }
`
