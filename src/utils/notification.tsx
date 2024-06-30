import { notification } from '@/contexts/GlobalContext'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons'
import { Flex, Progress } from 'antd'
import { IconType } from 'antd/es/notification/interface'

interface ProgressI {
  done: number
  total: number
  error: number
}

interface MessageI {
  type?: IconType
  title: string
}

function Icon(props: { icon: IconType }) {
  switch (props.icon) {
    case 'success':
      return <CheckCircleFilled style={{ color: '#00b96b' }} />
    case 'error':
      return <CloseCircleFilled style={{ color: 'red' }} />
    case 'warning':
      return <ExclamationCircleFilled style={{ color: 'orange' }} />
    default:
      return <InfoCircleFilled style={{ color: 'cyan' }} />
  }
}

function Message(props: { msg: MessageI }) {
  if (!props.msg.type) {
    return <div>{props.msg.title}</div>
  }
  return (
    <Flex gap="small" align="center">
      <Icon icon={props.msg.type} />
      {props.msg.title}
    </Flex>
  )
}

export class NotificationLogger {
  private msg: MessageI[] = []
  private progress: ProgressI
  private key: string
  private title: string
  private type: IconType

  constructor(key: string, title: string, type: IconType, total?: number) {
    this.key = key
    this.title = title
    this.type = type
    this.progress = {
      done: 0,
      total: total || 0,
      error: 0,
    }

    this.open()
  }

  private open(): void {
    notification.open({
      key: this.key,
      message: this.title,
      description: this.renderMessages(),
      icon: this.progress.total ? (
        <Progress
          percent={Math.ceil((this.progress.done / this.progress.total) * 100)}
          success={{
            percent: Math.ceil(
              (this.progress.error / this.progress.total) * 100,
            ),
            strokeColor: 'red',
          }}
          strokeColor="#00b96b"
          size={30}
          type="circle"
        />
      ) : undefined,
      type: this.type,
      duration: 0,
    })
  }

  private renderMessages(): JSX.Element {
    return (
      <div className="flex flex-col">
        {this.msg.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
      </div>
    )
  }

  addMsg(message: MessageI): void {
    this.msg.push(message)
    this.open()
  }

  success(message?: MessageI | string): void {
    this.progress.done++

    if (message) {
      this.addMsg(typeof message === 'string' ? { title: message } : message)
    }

    this.open()
  }

  error(message?: MessageI | string): void {
    this.progress.error++

    if (message) {
      this.addMsg(
        typeof message === 'string'
          ? { title: message, type: 'error' }
          : message,
      )
    }

    this.open()
  }
}
