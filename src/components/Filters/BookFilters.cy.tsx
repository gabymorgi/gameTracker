import { BookFilters } from './BookFilters'

describe('<BookFilters />', () => {
  it.only('should update URL when submitting form', () => {
    cy.mountWithContext(<BookFilters />)

    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('Name').type('test')
    cy.findByLabelText('Start').type('2024-10-15{enter}')
    cy.findByLabelText('End').type('2024-10-30{enter}')
    cy.findByLabelText('State').click()
    cy.findByTitle(/reading/i).click()
    cy.findByLabelText('Language').click()
    cy.findByTitle(/english/i).click()
    cy.findByLabelText('Sort by').click({ force: true })
    cy.findByTitle(/words/i).click()
    cy.findByLabelText('Order').click({ force: true })
    cy.findByTitle(/ascending/i).click()

    cy.findByRole('button', { name: /apply/i }).click()

    cy.url()
      .should('include', 'name=test')
      .and('include', 'start=2024-10-15')
      .and('include', 'end=2024-10-30')
      .and('include', 'state=READING')
      .and('include', 'language=English')
      .and('include', 'sortBy=words')
      .and('include', 'sortDirection=asc')
  })

  it('should reset URL', () => {
    cy.mountWithContext(<BookFilters />)

    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('Name').type('test')
    cy.findByRole('button', { name: /apply/i }).click()
    cy.url().should('include', 'name=test')

    cy.findByRole('button', { name: /reset/i }).click()

    cy.url().should('not.include', 'name=test')
  })
})
