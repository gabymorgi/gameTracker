import styled from 'styled-components'

interface ParsedLine {
  type: string
  examples: string
  description: string
}

const parseText = (text: string): ParsedLine[] => {
  const regex = /\(([^)]+)\) \[([^\]]+)\]: (.+)/g
  const matches: ParsedLine[] = []
  let match

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      type: match[1],
      examples: match[2],
      description: match[3],
    })
  }

  return matches
}

const StyledType = styled.span`
  color: #ffeb3b;
  font-size: 14px;
`

const StyledExample = styled.span`
  color: cyan;
  font-size: 24px;
`

const StyledDescription = styled.span`
  color: lightgray;
  font-size: 18px;
`

interface Props {
  definition?: string | null
}

function FormatedDefinition(props: Props) {
  if (!props.definition) return '-'
  const parsedLines = parseText(props.definition)

  return (
    <div>
      {parsedLines.map((line, index) => (
        <div key={index}>
          <StyledType>{line.type}</StyledType>{' '}
          <StyledExample>{line.examples}</StyledExample>:{' '}
          <StyledDescription>{line.description}</StyledDescription>
        </div>
      ))}
    </div>
  )
}

export default FormatedDefinition
