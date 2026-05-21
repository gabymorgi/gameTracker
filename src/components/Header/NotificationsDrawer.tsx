import { useEffect, useState } from 'react'
import { Badge, Button, Drawer, Flex, List, Typography } from 'antd'
import { mdiBell, mdiTrashCanOutline } from '@mdi/js'
import { Icon } from '@mdi/react'
import React from 'react'
import { useMutation, useQuery } from '@/hooks/useFetch'
import { Notification } from '@/ts/api/notifications'

const NotificationsDrawer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { data, fetchData, loading } = useQuery('notifications/get')
  const { mutate: deleteNotification, loading: deleting } = useMutation(
    'notifications/delete',
  )

  const notifications: Notification[] = data ?? []

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    await deleteNotification({ id })
    fetchData(undefined)
  }

  return (
    <>
      <Badge count={notifications.length} size="small">
        <Button
          icon={<Icon path={mdiBell} title="Notifications" size={1} />}
          onClick={() => setOpen(true)}
          loading={loading && !open}
        />
      </Badge>
      <Drawer
        title="Notifications"
        open={open}
        onClose={() => setOpen(false)}
        width={400}
      >
        <List
          loading={loading}
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
                  {item.createdAt.toLocaleString()}
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
