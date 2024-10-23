import { InputAchievements } from './InputAchievements'

describe('<InputAchievements />', () => {
  it('should show 0/0 when no value provided', () => {
    cy.mount(<InputAchievements />)

    cy.findAllByRole('spinbutton').should('have.length', 2).as('inputs')
    cy.get('@inputs').first().should('have.value', '0')
    cy.get('@inputs').last().should('have.value', '0')
  })

  it('should show the values provided', () => {
    cy.mount(
      <InputAchievements
        value={{
          obtained: 10,
          total: 20,
        }}
      />,
    )

    cy.findAllByRole('spinbutton').should('have.length', 2).as('inputs')
    cy.get('@inputs').first().should('have.value', '10')
    cy.get('@inputs').last().should('have.value', '20')
  })

  it('should call back on change', () => {
    cy.mount(
      <InputAchievements
        onChange={cy.stub().as('onChange')}
        value={{
          obtained: 10,
          total: 20,
        }}
      />,
    )

    cy.findAllByRole('spinbutton').should('have.length', 2).as('inputs')
    cy.get('@inputs').first().type('{backspace}5')
    cy.get('@onChange').should('have.been.calledWith', {
      obtained: 15,
      total: 20,
    })

    cy.get('@inputs').last().type('{backspace}5')
    cy.get('@onChange').should('have.been.calledWith', {
      obtained: 10,
      total: 25,
    })
  })
})
