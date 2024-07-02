import { Flex } from 'antd'
import styled from 'styled-components'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useContext } from 'react'

export const Tag = styled(Flex)<{ $hue?: number; size: 'small' | 'middle' }>`
  /* width: fit-content; */
  ${(props) => {
    const hue = props.$hue ?? 0
    return `
    color: hsl(${hue}, 100%, 70%);
    border: 2px solid hsl(${hue}, 100%, 70%);
    background: hsl(${hue}, 100%, 70%, 0.1);
  `
  }}
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 20px;
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
