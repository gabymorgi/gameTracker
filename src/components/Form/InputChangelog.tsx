import { MinusCircleFilled } from '@ant-design/icons'
import { Button, Col, Form, InputNumber, InputProps, Row } from 'antd'
import DatePicker from '@/components/ui/DatePicker'
import { InputHours } from '@/components/Form/InputHours'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { InputState } from './InputState'
import { GameI } from '@/ts/game'

interface InputChangelogProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: GameI
  onChange?: (value: GameI) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputChangelog(props: InputChangelogProps) {
  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Row gutter={[16, 0]} align="middle">
      <Col span={5}>
        <Form.Item
          label="Created At"
          name={[...fieldNames, 'createdAt']}
          rules={[{ required: true }]}
        >
          <DatePicker picker="month" />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item
          name={[...fieldNames, 'stateId']}
          label="State"
          rules={[{ required: true }]}
        >
          <InputState />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item label="Achievements" name={[...fieldNames, 'achievements']}>
          <InputNumber min={0} />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item label="Hours" name={[...fieldNames, 'hours']}>
          <InputHours />
        </Form.Item>
      </Col>
      {props.remove ? (
        <Col span={4} className="flex justify-end">
          <Button
            danger
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
