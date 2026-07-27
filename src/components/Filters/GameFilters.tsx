import { Button, Col, Collapse, Form, Input, Row, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { GlobalContext } from '@/contexts/GlobalContext'
import DatePicker from '@/components/ui/DatePicker'
import { useContext } from 'react'
import useGameFilters from '@/hooks/useGameFilters'
import { InputState } from '@/components/Form/InputState'

export const GameFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useGameFilters()
  const { tags } = useContext(GlobalContext)
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
                    <InputState allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="tags" label="Tags">
                    <Select
                      mode="tags"
                      allowClear
                      options={
                        tags
                          ? Object.keys(tags).map((key) => ({ value: key }))
                          : []
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="sortBy" label="Sort by">
                    <Select
                      allowClear
                      options={['name', 'start', 'end', 'hours', 'mark'].map(
                        (value) => ({
                          value,
                        }),
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item name="sortDirection" label="Order">
                    <Select
                      allowClear
                      options={['asc', 'desc'].map((value) => ({
                        value,
                      }))}
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
