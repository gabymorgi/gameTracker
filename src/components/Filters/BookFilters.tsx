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
                    <Select
                      allowClear
                      options={Object.keys(bookState).map((key) => ({
                        value: key,
                        label: key,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item name="language" label="Language">
                    <Select
                      allowClear
                      options={[
                        { value: 'English', label: 'English' },
                        { value: 'Spanish', label: 'Spanish' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="sortBy" label="Sort by">
                    <Select
                      allowClear
                      options={[
                        { value: 'name', label: 'Name' },
                        { value: 'start', label: 'Start' },
                        { value: 'end', label: 'End' },
                        { value: 'words', label: 'Words' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="sortDirection" label="Order">
                    <Select
                      allowClear
                      options={[
                        { value: 'asc', label: 'Ascending' },
                        { value: 'desc', label: 'Descending' },
                      ]}
                    />
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
