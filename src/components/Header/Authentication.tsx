import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { mdiLogin, mdiLogout } from '@mdi/js'
import Icon from '@mdi/react'
import React from 'react'
import { useForm } from 'antd/lib/form/Form'
import { Store } from 'antd/lib/form/interface'
import { Button, Flex, Form, Input, Modal } from 'antd'

const Authentication: React.FC = () => {
  const [form] = useForm()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const authContext = useContext(AuthContext)
  const handleSubmit = async (values: Store) => {
    try {
      setLoading(true)
      await authContext.logIn(values.email, values.password)
      setShowForm(false)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex justify="flex-end">
      {authContext.isAuthenticated ? (
        <Button
          loading={loading}
          onClick={authContext.logOut}
          icon={<Icon path={mdiLogout} title="Log out" size={1} />}
        />
      ) : (
        <Button
          loading={loading}
          onClick={() => setShowForm(true)}
          icon={<Icon path={mdiLogin} title="Show Login" size={1} />}
        />
      )}
      <Modal
        open={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
        title="Login"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          id="authentication"
          initialValues={{
            sortDirection: 'asc',
          }}
        >
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input type="password" />
          </Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            form="authentication"
            type="primary"
          >
            Login
          </Button>
        </Form>
      </Modal>
    </Flex>
  )
}

export default Authentication
