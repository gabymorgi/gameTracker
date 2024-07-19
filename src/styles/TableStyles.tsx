import styled from 'styled-components'
import { Card } from 'antd'
import Img from '@/components/ui/Img'

export const FullHeightCard = styled(Card)`
  height: 100%;
  .ant-card-body {
    height: 100%;
  }
`

export const GameImg = styled(Img)`
  width: 100%;
  /* max-height: 100px; */
  object-fit: cover;
  border-radius: 8px;
`
