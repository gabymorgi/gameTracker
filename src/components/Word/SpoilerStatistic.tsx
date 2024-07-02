import { Statistic } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.75);
    font-size: 16px;
  }
`

interface SpoilerStatisticProps {
  defaultIsLoading?: boolean
  title?: string | null
  value?: string | null
}

function SpoilerStatistic(props: SpoilerStatisticProps) {
  const [isLoading, setIsLoading] = useState(
    Boolean(props.value) && props.defaultIsLoading !== false,
  )
  return (
    <div onClick={() => setIsLoading(!isLoading)} className="pre-wrap">
      <StyledStatistic
        title={props.title}
        value={props.value || '-'}
        loading={isLoading}
      />
    </div>
  )
}

export default SpoilerStatistic
