import { ExtraScoreI } from '@/ts/index'
import { Col, Form, Input, InputProps, Row } from 'antd'
import { InputBias } from './InputBias'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'

interface InputCustomScoreProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: ExtraScoreI
  onChange?: (value: ExtraScoreI) => void
  fieldName?: NamePath
}

export function InputCustomScore(props: InputCustomScoreProps) {
  const fieldNames = formattedPathName(props.fieldName)
  return (
    <Row gutter={16} wrap={false}>
      <Col flex="none">
        <Form.Item name={[...fieldNames, 'bias']}>
          <InputBias />
        </Form.Item>
      </Col>
      <Col flex="auto">
        <Form.Item
          name={[...fieldNames, 'info']}
          // rules={[
          //   {
          //     required: true,
          //     message: 'Missing information',
          //   },
          // ]}
        >
          <Input className="w-full" />
        </Form.Item>
      </Col>
    </Row>
  )
}
