import useIsaacFilters from '@/hooks/useIsaacFilters'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
} from 'antd'
import { Store } from 'antd/lib/form/interface'

const options = [
  { label: 'Not played', value: 'not-played' },
  { label: 'Characters', value: 'characters' },
  { label: 'Challenges', value: 'challenges' },
  { label: 'Items', value: 'items' },
  { label: 'Enemies', value: 'enemies' },
  { label: 'QoL', value: 'qol' },
]

export const ModFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useIsaacFilters()
  const [form] = Form.useForm<Store>()
  const handleReset = () => {
    form.resetFields()
    setQueryParams({}, 'replace')
  }
  const handleSubmit = (values: Store) => {
    setQueryParams(values, 'replace')
  }

  return (
    <Card>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={queryParams}
      >
        <Row gutter={[32, 0]}>
          <Col span={6}>
            <Form.Item name="sortDirection" label="Sort">
              <Select allowClear>
                <Select.Option value="asc">Date Ascending</Select.Option>
                <Select.Option value="desc">Date Descending</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="filter" label="Filter">
              <Checkbox.Group options={options} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="appId" label="App Id">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col>
            <Button onClick={handleReset}>Reset</Button>
          </Col>
          <Col>
            <Button htmlType="submit">Apply</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
