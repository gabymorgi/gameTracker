import { Col, Form, InputNumber, Row } from 'antd'
import DatePicker from '@/components/ui/DatePicker'
import { InputHours } from '@/components/Form/InputHours'
import { ChangelogI } from '@/ts/game'
import InputSearchGame from '@/components/Form/InputSearchGame'
import { InputState } from '@/components/Form/InputState'

interface ChangelogCardI {
  changelogId: string
  changelog?: ChangelogI
  onFinish: (values: ChangelogI, id?: string) => void
}

function ChangelogForm(props: ChangelogCardI) {
  return (
    <Form
      id="changelog-form"
      layout="vertical"
      initialValues={props.changelog}
      onFinish={(values) => props.onFinish(values, props.changelogId)}
    >
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Form.Item name="gameId" label="Game ID" rules={[{ required: true }]}>
            <InputSearchGame />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="createdAt" label="Date" rules={[{ required: true }]}>
            <DatePicker picker="month" />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item name="hours" label="Hours" rules={[{ required: true }]}>
            <InputHours />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="achievements"
            label="Achievements"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item name="stateId" label="State" rules={[{ required: true }]}>
            <InputState allowClear />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default ChangelogForm
