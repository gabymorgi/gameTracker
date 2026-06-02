import { useEffect, useState } from 'react'
import { Badge, Button, Drawer, Flex, List, Typography } from 'antd'
import { mdiBell, mdiTrashCanOutline } from '@mdi/js'
import { Icon } from '@mdi/react'
import React from 'react'
import { query, useMutation } from '@/hooks/useFetch'
import { Notification } from '@/ts/api/notifications'

const NotificationsDrawer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { mutate: deleteNotification, loading: deleting } = useMutation(
    'notifications/delete',
  )

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true)
      try {
        const data = await query('notifications/get', undefined)
        setNotifications(data)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteNotification({ id })
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <>
      <Badge count={notifications.length} size="small">
        <Button
          icon={<Icon path={mdiBell} title="Notifications" size={1} />}
          onClick={() => setOpen(true)}
          loading={isLoading && !open}
        />
      </Badge>
      <Drawer
        title="Notifications"
        open={open}
        onClose={() => setOpen(false)}
        size={400}
      >
        <List
          loading={isLoading}
          dataSource={notifications}
          locale={{ emptyText: 'No notifications' }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={
                    <Icon path={mdiTrashCanOutline} title="Delete" size={0.8} />
                  }
                  loading={deleting}
                  onClick={() => handleDelete(item.id)}
                />,
              ]}
            >
              <Flex vertical gap={2}>
                <Typography.Text className="pre-wrap">
                  {item.message}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {item.createdAt.toLocaleString('en-US', {
                    timeZone: 'UTC',
                  })}
                </Typography.Text>
              </Flex>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  )
}

export default NotificationsDrawer
