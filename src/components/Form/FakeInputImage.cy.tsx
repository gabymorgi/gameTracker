import { FakeInputImage } from './FakeInputImage'

describe('<FakeInputImage />', () => {
  it('should render img based on value', () => {
    const url =
      'https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcRS7Outpkdd8Ir9TmzQnF5HxJr6nIhJIl2Cgp0mkLtlzF4zSRCx5Wa2bbKkgkUbp741Rso7ZYl90gzJmke9bkE'
    cy.mount(<FakeInputImage value={url} />)

    cy.get('img').should('have.attr', 'src', url)
  })

  it('should render error img when no value', () => {
    cy.mount(<FakeInputImage />)

    cy.get('img').should('not.exist')

    cy.findByText('Error').should('exist')
  })
})
