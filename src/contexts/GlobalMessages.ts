import { MessageInstance } from 'antd/es/message/interface'
import { NotificationInstance } from 'antd/es/notification/interface'

export class GlobalMessages {
  public notification: NotificationInstance | undefined
  public message: MessageInstance | undefined

  private static instance: GlobalMessages

  static getInstance() {
    if (!this.instance) {
      this.instance = new GlobalMessages()
    }
    return this.instance
  }

  public config(notification: NotificationInstance, message: MessageInstance) {
    this.notification = notification
    this.message = message
  }
}
