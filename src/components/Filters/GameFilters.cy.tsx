import { GameFilters } from './GameFilters'

describe('<GameFilters />', () => {
  it.only('should update URL when submitting form', () => {
    cy.mountWithContext(<GameFilters />)

    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('Name').type('test')
    cy.findByLabelText('Start').type('2024-10-15{enter}')
    cy.findByLabelText('End').type('2024-10-30{enter}')
    cy.findByLabelText('State').click()
    cy.findByText('WON').click()
    cy.findByLabelText('Tags').click()
    cy.findByText('Board').click()
    cy.get('body').type('{esc}')
    cy.findByLabelText('Sort by').click({ force: true })
    cy.findByText('Hours').click()
    cy.findByLabelText('Order').click({ force: true })
    cy.findByText('Ascending').click()

    cy.findByRole('button', { name: /apply/i }).click()

    cy.url()
      .should('include', 'name=test')
      .and('include', 'start=2024-10-15')
      .and('include', 'end=2024-10-30')
      .and('include', 'state=WON')
      .and('include', 'tags=Board')
      .and('include', 'sortBy=hours')
      .and('include', 'sortDirection=asc')
  })

  it('should reset URL', () => {
    cy.mountWithContext(<GameFilters />)

    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('Name').type('test')
    cy.findByRole('button', { name: /apply/i }).click()
    cy.url().should('include', 'name=test')

    cy.findByRole('button', { name: /reset/i }).click()

    cy.url().should('not.include', 'name=test')
  })
})
