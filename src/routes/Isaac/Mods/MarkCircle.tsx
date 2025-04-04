import styled from 'styled-components'

const colors = [0, 27, 41, 55, 73, 99, 143, 160, 175, 188, 200]

const Background = styled.div<{ $mark: number }>`
  text-align: center;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  border-style: solid;
  font-weight: bold;
  border-color: ${(props) => `hsl(${colors[props.$mark]}, 100%, 50%)`};
`

function MarkCircle({ mark }: { mark: number }) {
  return mark > -1 ? (
    <Background $mark={mark}>
      <span>{mark}</span>
    </Background>
  ) : (
    '-'
  )
}

export default MarkCircle
