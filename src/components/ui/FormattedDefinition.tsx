import styled from 'styled-components'

interface ParsedLine {
  type: string
  examples: string
  description: string
}

const parseText = (text: string): [ParsedLine[], boolean] => {
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

  const linesAmount = text.split('\n').length

  return [matches, linesAmount !== matches.length]
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

const StyledWarning = styled.span`
  color: red;
  font-size: 16px;
`

interface Props {
  definition?: string | null
}

function FormatedDefinition(props: Props) {
  if (!props.definition) return '-'
  const [parsedLines, warning] = parseText(props.definition)

  return (
    <div>
      {parsedLines.map((line, index) => (
        <div key={index}>
          <StyledType>{line.type}</StyledType>{' '}
          <StyledExample>{line.examples}</StyledExample>:{' '}
          <StyledDescription>{line.description}</StyledDescription>
        </div>
      ))}
      {warning && (
        <div>
          <StyledWarning>
            Warning: Some lines are not formatted correctly
          </StyledWarning>
        </div>
      )}
    </div>
  )
}

export default FormatedDefinition
