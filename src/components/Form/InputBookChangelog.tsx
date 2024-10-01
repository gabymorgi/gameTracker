import { MinusCircleFilled } from '@ant-design/icons'
import { Button, Col, Form, InputNumber, InputProps, Row } from 'antd'
import DatePicker from '@/components/ui/DatePicker'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { Game } from '@/ts/api/games'

interface InputBookChangelogProps
  extends Omit<InputProps, 'value' | 'onChange'> {
  value?: Game
  onChange?: (value: Game) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputBookChangelog(props: InputBookChangelogProps) {
  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Row gutter={[16, 0]} align="middle">
      <Col xs={12} sm={8}>
        <Form.Item
          label="Created At"
          name={[...fieldNames, 'createdAt']}
          rules={[{ required: true }]}
        >
          <DatePicker picker="month" />
        </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
        <Form.Item label="Words" name={[...fieldNames, 'words']}>
          <InputNumber className="w-full" />
        </Form.Item>
      </Col>
      {props.remove ? (
        <Col xs={24} sm={8} className="flex justify-end">
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
