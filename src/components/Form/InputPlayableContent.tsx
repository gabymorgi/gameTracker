import { MinusCircleFilled } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Row,
  Select,
} from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { $Enums } from '#prisma-generated-client'
import { Changelog } from '@/ts/api/changelogs'

interface InputPlayableContentProps extends Omit<
  InputProps,
  'value' | 'onChange'
> {
  value?: Changelog
  onChange?: (value: Changelog) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputPlayableContent(props: InputPlayableContentProps) {
  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Row gutter={[16, 0]} align="middle">
      <Col xs={24} sm={16}>
        <Form.Item
          label="Name"
          name={[...fieldNames, 'name']}
          rules={[{ required: true, message: 'Please enter a character name' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={12} sm={4}>
        <Form.Item label="Type" name={[...fieldNames, 'type']}>
          <Select
            options={Object.keys($Enums.ContentType).map((key) => ({
              value: key,
              label: key,
            }))}
          />
        </Form.Item>
      </Col>
      <Col xs={12} sm={4}>
        <Form.Item label="Mark" name={[...fieldNames, 'mark']}>
          <InputNumber min={-1} max={10} className="w-full" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Description" name={[...fieldNames, 'description']}>
          <Input.TextArea />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Review" name={[...fieldNames, 'review']}>
          <Input.TextArea />
        </Form.Item>
      </Col>
      {props.remove ? (
        <Col span={24}>
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
