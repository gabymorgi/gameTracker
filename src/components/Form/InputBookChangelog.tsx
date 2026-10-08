import { mdiMinusCircleOutline } from '@mdi/js'
import { Icon } from '@/components/ui/Icon'
import { Button, Col, Form, InputProps, Row } from 'antd'
import { InputPages } from './InputPages'
import DatePicker from '@/components/ui/DatePicker'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { BookChangelog } from '@/ts/api/books'

interface InputBookChangelogProps extends Omit<
  InputProps,
  'value' | 'onChange'
> {
  value?: BookChangelog
  onChange?: (value: BookChangelog) => void
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
        <Form.Item label="Pages" name={[...fieldNames, 'pages']}>
          <InputPages />
        </Form.Item>
      </Col>
      {props.remove ? (
        <Col xs={24} sm={8} className="flex justify-end">
          <Button
            danger
            style={{ marginTop: 8 }} // align with the input
            type="default"
            onClick={() => props.remove?.()}
            icon={<Icon path={mdiMinusCircleOutline} />}
          >
            Remove
          </Button>
        </Col>
      ) : null}
    </Row>
  )
}
