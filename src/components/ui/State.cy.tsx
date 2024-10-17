import { State } from './State'

describe('<State />', () => {
  it('renders', () => {
    cy.mountWithContext(<State state="PLAYING" />)
    cy.contains('PLAYING').should('exist')
  })
})
