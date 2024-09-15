import { Button, Col, Collapse, Form, Input, Row, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import DatePicker from '@/components/ui/DatePicker'
import useBookFilters from '@/hooks/useBookFilters'
import { bookState } from '@/ts/api/books'

export const BookFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useBookFilters()
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
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item name="name" label="Name">
                    <Input type="text" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Form.Item name="start" label="Start">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Form.Item name="end" label="End">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item name="state" label="State">
                    <Select allowClear>
                      {Object.keys(bookState).map((key) => (
                        <Select.Option key={key} value={key}>
                          {key}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item name="language" label="Language">
                    <Select allowClear>
                      <Select.Option value="English">English</Select.Option>
                      <Select.Option value="Spanish">Spanish</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="sortBy" label="Sort by">
                    <Select allowClear>
                      <Select.Option value="name">Name</Select.Option>
                      <Select.Option value="start">Start</Select.Option>
                      <Select.Option value="end">End</Select.Option>
                      <Select.Option value="words">Words</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="sortDirection" label="Order">
                    <Select allowClear>
                      <Select.Option value="asc">Ascending</Select.Option>
                      <Select.Option value="desc">Descending</Select.Option>
                    </Select>
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
