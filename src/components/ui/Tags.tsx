import { Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { GlobalContext } from '@/contexts/GlobalContext'

export const Tag = styled.div<{ hue?: number }>`
  width: fit-content;
  display: flex;
  gap: 8px;
  ${(props) => `
    color: ${props.hue !== undefined ? `hsl(${props.hue}, 100%, 70%)` : '#808080'};
    border: 2px solid ${props.hue !== undefined ? `hsl(${props.hue}, 100%, 70%)` : '#808080'};
    background: ${props.hue !== undefined ? `hsl(${props.hue}, 100%, 15%)` : '#808080'};
  `}
  font-weight: bold;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;
`

export const Tags: React.FC<{ tags?: Array<{tagId: string}> }> = ({ tags }) => {
  const { tags: tagsTemplates } = React.useContext(GlobalContext)
  return (
    <Row gutter={[8, 8]}>
      {tags?.map((t) => (
        <Col key={t.tagId}>
          <Tag hue={tagsTemplates?.[t.tagId]}>{t.tagId}</Tag>
        </Col>
      )) || (
        <Col>
          <Tag>No tags</Tag>
        </Col>
      )}
    </Row>
  )
}
