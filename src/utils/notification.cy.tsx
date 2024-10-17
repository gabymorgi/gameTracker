import { IconType } from 'antd/es/notification/interface'
import { NotificationLogger } from './notification'
import { useRef } from 'react'

interface AddMsgAction {
  actionType: 'addMsg'
  title: string
  type?: IconType
}

interface SuccessAction {
  actionType: 'success'
  title: string
  type?: Exclude<IconType, 'error'>
}

interface ErrorAction {
  actionType: 'error'
  title: string
}

type Action = AddMsgAction | SuccessAction | ErrorAction

interface Props {
  total: number
  actions: Array<Action>
}

const NotificationLoggerComponent = (props: Props) => {
  const index = useRef(0)
  const ref = useRef<NotificationLogger>()
  function openLogger() {
    ref.current = new NotificationLogger('key', 'title', props.total)
  }
  function executeAction() {
    const action = props.actions[index.current]
    const logger = ref.current
    if (!logger) {
      return
    }
    switch (action.actionType) {
      case 'addMsg':
        logger.addMsg(action)
        break
      case 'success':
        logger.success(action.title, action.type)
        break
      case 'error':
        logger.error(action.title)
        break
    }
    index.current++
  }
  return (
    <div>
      <button onClick={openLogger}>create</button>
      <button onClick={executeAction}>execute</button>
    </div>
  )
}

describe('NotificationLogger', () => {
  it('renders', () => {
    cy.mountWithContext(<NotificationLoggerComponent total={2} actions={[]} />)
    cy.findByText('create').click()
    cy.contains('title').should('exist')
  })

  it('should be able to add message', () => {
    cy.mountWithContext(
      <NotificationLoggerComponent
        total={8}
        actions={[
          { actionType: 'addMsg', title: 'no type message' },
          { actionType: 'addMsg', title: 'success message', type: 'success' },
          { actionType: 'addMsg', title: 'info message', type: 'info' },
          { actionType: 'addMsg', title: 'warning message', type: 'warning' },
          { actionType: 'addMsg', title: 'error message', type: 'error' },
        ]}
      />,
    )
    cy.findByText('create').click()
    cy.findByText('execute').as('execute')

    cy.get('@execute').click({ force: true })
    cy.contains('div', 'no type message').should('be.visible')

    cy.get('@execute').click({ force: true })
    cy.contains('div', 'success message').within(() => {
      cy.findByLabelText('check-circle').should('be.visible')
    })

    cy.get('@execute').click({ force: true })
    cy.contains('div', 'info message').within(() => {
      cy.findByLabelText('info-circle').should('be.visible')
    })

    cy.get('@execute').click({ force: true })
    cy.contains('div', 'warning message').within(() => {
      cy.findByLabelText('exclamation-circle').should('be.visible')
    })

    cy.get('@execute').click({ force: true })
    cy.contains('div', 'error message').within(() => {
      cy.findByLabelText('close-circle').should('be.visible')
    })
  })

  it.only('should be able to add message', () => {
    cy.mountWithContext(
      <NotificationLoggerComponent
        total={3}
        actions={[
          { actionType: 'success', title: 'success message' },
          { actionType: 'success', title: 'warning message', type: 'warning' },
          { actionType: 'error', title: 'error message' },
        ]}
      />,
    )
    cy.findByText('create').click()
    cy.findByText('execute').as('execute')
    cy.findByRole('progressbar').as('progressbar')

    cy.get('@execute').click({ force: true })
    cy.get('@progressbar').within(() => {
      cy.findByTitle('34%').should('be.visible')
    })

    cy.get('@execute').click({ force: true })
    cy.get('@progressbar').within(() => {
      cy.findByTitle('67%').should('be.visible')
    })

    cy.get('@execute').click({ force: true })
    cy.get('@progressbar').within(() => {
      cy.findByTitle('100%').should('be.visible')
    })
  })
})
