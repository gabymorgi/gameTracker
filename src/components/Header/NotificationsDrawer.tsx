import { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Drawer, Flex, Listy, Spin, Typography } from 'antd'
import { mdiBell, mdiReload, mdiTrashCanOutline } from '@mdi/js'
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

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await query('notifications/get', undefined)
      setNotifications(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

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
        extra={
          <Button
            type="text"
            onClick={() => fetchNotifications()}
            icon={<Icon path={mdiReload} title="Refresh" size={1} />}
          />
        }
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        size={400}
      >
        <Spin spinning={isLoading}>
          <Listy
            rowKey="id"
            items={notifications}
            itemRender={(item) => (
              <div className="relative">
                <div
                  style={{ position: 'absolute', top: 4, left: 4, zIndex: 1 }}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={
                      <Icon
                        path={mdiTrashCanOutline}
                        title="Delete"
                        size={0.8}
                      />
                    }
                    loading={deleting}
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
                <Flex vertical gap={2} style={{ paddingLeft: 32 }}>
                  <Typography.Text className="pre-wrap">
                    {item.message}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {item.createdAt.toLocaleString('en-US', {
                      timeZone: 'UTC',
                    })}
                  </Typography.Text>
                </Flex>
              </div>
            )}
          />
        </Spin>
      </Drawer>
    </>
  )
}

export default NotificationsDrawer
