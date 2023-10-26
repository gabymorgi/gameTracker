import React from 'react'
import styled from 'styled-components'

export const StyledStatistic = styled.div`
  .label {
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
  }
  .value {
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
  }
`

export const Statistic: React.FC<{
  label: React.ReactNode
  value: React.ReactNode
}> = ({ label, value }) => {
  return (
    <StyledStatistic>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </StyledStatistic>
  )
}
