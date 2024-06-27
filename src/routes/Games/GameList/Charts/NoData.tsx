import { mdiDatabaseOff } from '@mdi/js'
import Icon from '@mdi/react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  font-size: 36px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const NoData: React.FC = () => {
  return (
    <Container>
      <span>No data</span>
      <Icon path={mdiDatabaseOff} size={3} color="white" />
    </Container>
  )
}
