import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Row,
  Select,
} from 'antd'
import { useCallback } from 'react'
import { FakeInputImage } from './FakeInputImage'
import DatePicker from '@/components/ui/DatePicker'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { BookI, BookState } from '@/ts/books'

interface InputBookProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: BookI
  onChange?: (value: BookI) => void
  ban?: (appid: number) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputBook(props: InputBookProps) {
  const disabledStartDate = useCallback(
    (current: Date) => {
      return current > (props.value?.end || Infinity)
    },
    [props.value?.end],
  )

  const disabledEndDate = useCallback(
    (current: Date) => {
      return current < (props.value?.start || 0)
    },
    [props.value?.start],
  )

  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Card size="small">
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={8} md={7} lg={6} xl={6}>
          <Form.Item name={[...fieldNames, 'imageUrl']}>
            <FakeInputImage />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={7} lg={6} xl={6}>
          <Form.Item
            name={[...fieldNames, 'name']}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input size="middle" type="text" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={7} lg={6} xl={6}>
          <Form.Item label="Image URL" name={[...fieldNames, 'imageUrl']}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3} xl={3}>
          <Form.Item
            label="state"
            name={[...fieldNames, 'state']}
            rules={[{ required: true }]}
          >
            <Select allowClear>
              {Object.keys(BookState).map((key) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3} xl={3}>
          <Form.Item
            label="language"
            name={[...fieldNames, 'language']}
            rules={[{ required: true }]}
          >
            <Select allowClear>
              <Select.Option value="English">English</Select.Option>
              <Select.Option value="Spanish">Spanish</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item
            label="Start"
            name={[...fieldNames, 'start']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledStartDate} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item
            label="End"
            name={[...fieldNames, 'end']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledEndDate} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item label="Words" name={[...fieldNames, 'playedTime']}>
            <InputNumber className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={2}>
          <Form.Item label="Mark" name={[...fieldNames, 'mark']}>
            <InputNumber min={-1} max={10} className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Review" name={[...fieldNames, 'review']}>
            <Input.TextArea
              autoSize={{ minRows: 3 }}
              placeholder="Book Review"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}
