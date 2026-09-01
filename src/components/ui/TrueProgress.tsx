import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  background: #ffffff1e;
  font-size: 12px;
`

const Segment = styled.div<{ color?: string; $flexGrow: number }>`
  height: 20px;
  background-color: ${({ color }) => color || 'transparent'};
  flex-grow: ${({ $flexGrow }) => $flexGrow};
  min-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: white;
  font-weight: bold;
  transition: flex-grow 0.3s ease;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;

  span {
    padding: 0 8px;
  }
`

interface TrueProgressProps {
  obtainedActual: number
  obtainedTotal: number
  total: number
  color?: string
  formatLabel?: (value: number) => string
}

export const TrueProgress: React.FC<TrueProgressProps> = (props) => {
  if (props.total < 1) {
    return <div>No data</div>
  }

  const mainColor = props.color ?? 'hsl(180 80% 30%)'
  const darkColor = props.color
    ? props.color.replace(/\d+%\)$/, (m) => `${Math.max(0, parseInt(m) - 8)}%)`)
    : 'hsl(180 80% 22%)'
  const fmt = props.formatLabel ?? String

  const obtainedRemaining = props.obtainedTotal - props.obtainedActual
  const totalRemaining = props.total - props.obtainedTotal

  return (
    <Container>
      {props.obtainedTotal > 0 && (
        <Segment color={mainColor} $flexGrow={props.obtainedTotal}>
          {obtainedRemaining > 0 && (
            <Segment color={darkColor} $flexGrow={obtainedRemaining}>
              <span>{fmt(obtainedRemaining)}</span>
            </Segment>
          )}
          {props.obtainedActual > 0 && (
            <Segment $flexGrow={props.obtainedActual}>
              <span>{fmt(props.obtainedActual)}</span>
            </Segment>
          )}
        </Segment>
      )}
      {totalRemaining > 0 && (
        <Segment $flexGrow={totalRemaining}>
          <span>{fmt(totalRemaining)}</span>
        </Segment>
      )}
    </Container>
  )
}
