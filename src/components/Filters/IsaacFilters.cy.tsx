import { ModFilters } from './IsaacFilters'

describe('<ModFilters />', () => {
  it.only('should update URL when submitting form', () => {
    cy.mountWithContext(<ModFilters />)

    cy.findByLabelText('Not played').click()
    cy.findByLabelText('Characters').click()
    cy.findByLabelText('Challenges').click()
    cy.findByLabelText('Items').click()
    cy.findByLabelText('Enemies').click()
    cy.findByLabelText('QoL').click()
    cy.findByLabelText('Sort').click()
    cy.findByText('Date Ascending').click()
    cy.findByLabelText('App Id').type('12345')

    cy.findByRole('button', { name: /apply/i }).click()

    cy.url()
      .should('include', 'appId=12345')
      .and('include', 'filter=not-played')
      .and('include', 'filter=characters')
      .and('include', 'filter=challenges')
      .and('include', 'filter=items')
      .and('include', 'filter=enemies')
      .and('include', 'filter=qol')
      .and('include', 'sortDirection=asc')
  })

  it('should reset URL', () => {
    cy.mountWithContext(<ModFilters />)

    cy.findByLabelText('Enemies').click()
    cy.findByRole('button', { name: /apply/i }).click()
    cy.url().should('include', 'filter=enemies')

    cy.findByRole('button', { name: /reset/i }).click()

    cy.url().should('not.include', 'filter=enemies')
  })
})
