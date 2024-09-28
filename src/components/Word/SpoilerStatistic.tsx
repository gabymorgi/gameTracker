import { Flex, Skeleton } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledStatistic = styled(Flex)`
  .title {
    color: greenyellow;
    font-size: 16px;
  }
  .value {
    color: lightgray;
    font-size: 16px;
  }
`

interface SpoilerStatisticProps {
  defaultIsLoading?: boolean
  title?: string | null
  value?: React.ReactNode
}

function SpoilerStatistic(props: SpoilerStatisticProps) {
  const [isLoading, setIsLoading] = useState(
    Boolean(props.value) && props.defaultIsLoading !== false,
  )
  return (
    <StyledStatistic
      vertical
      gap="middle"
      onClick={() => setIsLoading(!isLoading)}
      className="pre-wrap"
    >
      <div className="title">{props.title}</div>
      {isLoading && props.value ? (
        <Skeleton.Button block style={{ width: '100%' }} size="small" />
      ) : (
        <div className="value">{props.value || '-'}</div>
      )}
    </StyledStatistic>
  )
}

export default SpoilerStatistic
