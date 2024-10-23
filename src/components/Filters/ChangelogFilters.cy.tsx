import { ChangelogFilters } from './ChangelogFilters'

describe('<ChangelogFilters />', () => {
  it('should update URL when submitting form', () => {
    cy.mountWithContext(<ChangelogFilters />)

    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('From').type('2024-10-15{enter}')
    cy.findByLabelText('To').type('2024-10-30{enter}')

    cy.findByRole('button', { name: /apply/i }).click()

    cy.url()
      .should('include', 'from=2024-10-15')
      .and('include', 'to=2024-10-30')

    // Reset URL
    cy.window().then((win) => {
      win.history.replaceState({}, '', '/')
    })
  })

  it('should reset URL', () => {
    cy.mountWithContext(<ChangelogFilters />)
    cy.url().should('not.include', 'from=2024-10-15')
    cy.findByRole('button', { name: /filters/i }).click()

    cy.findByLabelText('From').type('2024-10-15{enter}')
    cy.findByRole('button', { name: /apply/i }).click()
    cy.url().should('include', 'from=2024-10-15')

    cy.findByRole('button', { name: /reset/i }).click()

    cy.url().should('not.include', 'from=2024-10-15')
  })
})
