import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { mdiLogin, mdiLogout } from '@mdi/js'
import Icon from '@mdi/react'
import React from 'react'
import { useForm } from 'antd/lib/form/Form'
import { Store } from 'antd/lib/form/interface'
import { Button, Form, Input } from 'antd'

const Authentication: React.FC = () => {
  const [form] = useForm()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const authContext = useContext(AuthContext)
  const handleSubmit = async (values: Store) => {
    setLoading(true)
    await authContext.logIn(values.email, values.password)
    setLoading(false)
  }

  return (
    <div className="flex justify-end">
      {authContext.isAuthenticated ? (
        <Button
          loading={loading}
          onClick={authContext.logOut}
          icon={<Icon path={mdiLogout} title="Log out" size={1} />}
        />
      ) : showForm ? (
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="inline"
          id="authentication"
          initialValues={{
            sortDirection: 'asc',
          }}
        >
          <div className="flex gap-16">
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
              icon={<Icon path={mdiLogin} title="Log in" size={1} />}
            />
          </div>
        </Form>
      ) : (
        <Button
          loading={loading}
          onClick={() => setShowForm(true)}
          icon={<Icon path={mdiLogin} title="Show Login" size={1} />}
        />
      )}
    </div>
  )
}

export default Authentication
