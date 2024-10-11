import { State } from './State'

describe('<State />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<State state="PLAYING" />)
    cy.contains('PLAYING').should('exist')
  })
})
