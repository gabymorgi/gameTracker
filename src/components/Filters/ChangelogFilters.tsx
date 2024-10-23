import { Button, Col, Collapse, Form, Row } from 'antd'
import { Store } from 'antd/lib/form/interface'
import DatePicker from '@/components/ui/DatePicker'
import useChangelogFilters from '@/hooks/useChangelogFilters'

export const ChangelogFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useChangelogFilters()
  const [form] = Form.useForm<Store>()
  const handleReset = () => {
    form.resetFields()
    setQueryParams({}, 'replace')
  }
  const handleSubmit = (values: Store) => {
    setQueryParams(values, 'replace')
  }

  return (
    <Collapse
      items={[
        {
          key: '1',
          label: 'Filters',
          children: (
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={queryParams}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Form.Item name="from" label="From">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Form.Item name="to" label="To">
                    <DatePicker />
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
          ),
        },
      ]}
    />
  )
}
