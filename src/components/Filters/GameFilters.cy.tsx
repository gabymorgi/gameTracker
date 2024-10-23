import { GameFilters } from './GameFilters'

describe('<GameFilters />', () => {
  it.only('should update URL when submitting form', () => {
    cy.mountWithContext(<GameFilters />)

    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('Name').type('test')
    cy.findByLabelText('Start').type('2024-10-15{enter}')
    cy.findByLabelText('End').type('2024-10-30{enter}')
    cy.findByLabelText('State').select('WON')
    cy.findByLabelText('Tags').select('platformer')
    cy.findByLabelText('Sort By').select('name')
    cy.findByLabelText('Order').select('desc')

    cy.findByRole('button', { name: /apply/i }).click()

    cy.url()
      .should('include', 'name=test')
      .and('include', 'start=2024-10-15')
      .and('include', 'end=2024-10-30')
      .and('include', 'state=WON')
      .and('include', 'tags=Platformer')
      .and('include', 'sortBy=name')
      .and('include', 'sortDirection=desc')
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
