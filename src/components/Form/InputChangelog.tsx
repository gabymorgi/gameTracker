import { MinusCircleFilled } from '@ant-design/icons'
import { Button, Col, Form, InputNumber, InputProps, Row } from 'antd'
import DatePicker from '@/components/ui/DatePicker'
import { InputHours } from '@/components/Form/InputHours'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { InputState } from './InputState'
import { Changelog } from '@/ts/api/changelogs'

interface InputChangelogProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: Changelog
  onChange?: (value: Changelog) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputChangelog(props: InputChangelogProps) {
  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Row gutter={[16, 0]} align="middle">
      <Col xs={12} sm={5}>
        <Form.Item
          label="Created At"
          name={[...fieldNames, 'createdAt']}
          rules={[{ required: true }]}
        >
          <DatePicker picker="month" />
        </Form.Item>
      </Col>
      <Col xs={12} sm={5}>
        <Form.Item
          name={[...fieldNames, 'state']}
          label="State"
          rules={[{ required: true }]}
        >
          <InputState />
        </Form.Item>
      </Col>
      <Col xs={12} sm={4} md={5}>
        <Form.Item label="Achievements" name={[...fieldNames, 'achievements']}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </Col>
      <Col xs={12} sm={5}>
        <Form.Item label="Hours" name={[...fieldNames, 'hours']}>
          <InputHours />
        </Form.Item>
      </Col>
      {props.remove ? (
        <Col xs={24} sm={5} md={4} className="flex justify-end">
          <Button
            danger
            style={{ marginTop: 8 }} // align with the input
            type="default"
            onClick={() => props.remove?.()}
            icon={<MinusCircleFilled />}
          >
            Remove
          </Button>
        </Col>
      ) : null}
    </Row>
  )
}
