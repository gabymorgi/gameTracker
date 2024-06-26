import { Col, Row } from 'antd'
import styled from 'styled-components'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useContext } from 'react'

export const Tag = styled.div<{ $hue?: number }>`
  width: fit-content;
  display: flex;
  gap: 8px;
  ${(props) => `
    color: ${
      props.$hue !== undefined ? `hsl(${props.$hue}, 100%, 70%)` : '#fff'
    };
    border: 2px solid ${
      props.$hue !== undefined ? `hsl(${props.$hue}, 100%, 70%)` : '#fff'
    };
    background: ${
      props.$hue !== undefined ? `hsl(${props.$hue}, 100%, 15%)` : '#808080'
    };
  `}
  font-weight: bold;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;
`

export const Tags: React.FC<{ tags: string[] }> = ({ tags }) => {
  const { tags: tagsTemplates } = useContext(GlobalContext)
  return (
    <Row gutter={[8, 8]}>
      {tags.map((t) => (
        <Col key={t}>
          <Tag $hue={tagsTemplates?.[t]}>{t}</Tag>
        </Col>
      ))}
    </Row>
  )
}
