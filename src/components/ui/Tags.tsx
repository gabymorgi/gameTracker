import { Flex } from 'antd'
import styled, { css } from 'styled-components'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useContext } from 'react'

export const Tag = styled(Flex)<{ $hue?: number; size: 'small' | 'middle' }>`
  ${(props) => {
    const hue = props.$hue ?? 0
    return css`
      color: hsl(${hue}, 70%, 70%);
      border: 1px solid hsl(${hue}, 60%, 40%);
      background: hsl(${hue}, 40%, 10%);
    `
  }}
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 4px;
  padding: ${(props) => (props.size === 'small' ? '0px 8px' : '4px 12px')};
`

export const Tags: React.FC<{ tags: string[] }> = ({ tags }) => {
  const { tags: tagsTemplates } = useContext(GlobalContext)
  return (
    <Flex wrap justify="center" gap="small">
      {tags.map((t) => (
        <Tag size="small" key={t} $hue={tagsTemplates?.[t]} gap="small">
          {t}
        </Tag>
      ))}
    </Flex>
  )
}
