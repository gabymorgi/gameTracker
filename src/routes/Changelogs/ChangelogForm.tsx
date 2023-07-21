import { Form, Input, InputNumber, Select } from 'antd'
import { DatePicker } from '@/components/ui/DatePicker'
import { InputHours } from '@/components/Form/InputHours'
import { useContext } from 'react'
import { TagsContext } from '@/contexts/TagsContext'
import { DocumentChangelogI } from 'ts'

interface ChangelogCardI {
  changelogId: string
  changelog?: DocumentChangelogI
  onFinish: (values: any, id?: string) => void
}

function ChangelogForm(props: ChangelogCardI) {
  const { states } = useContext(TagsContext)
  return (
    <Form
      id='changelog-form'
      layout='vertical'
      initialValues={props.changelog}
      onFinish={(values) =>
        props.onFinish(values, props.changelogId)
      }
    >
      <Form.Item
        name='gameId'
        label='Game ID'
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='gameName'
        label='Game Name'
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='createdAt'
        label='Date'
        rules={[{ required: true }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name='hours'
        label='Hours'
        rules={[{ required: true }]}
      >
        <InputHours />
      </Form.Item>
      <Form.Item
        name='achievements'
        label='Achievements'
        rules={[{ required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name='state'
        label='State'
        rules={[{ required: true }]}
      >
        <Select allowClear>
          {states &&
            Object.keys(states).map((key) => (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    </Form>
  )
}

export default ChangelogForm
