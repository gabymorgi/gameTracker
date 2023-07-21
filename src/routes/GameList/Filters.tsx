import { App, Button, Col, Collapse, Form, Input, Row, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { TagsContext } from '@/contexts/TagsContext'
import { DatePicker } from '@/components/ui/DatePicker'
import { useContext } from 'react'
import useGameFilters from '@/hooks/useGameFilters'

export const Filters: React.FC = () => {
  const { notification } = App.useApp()
  const { setQuery } = useGameFilters()
  const { tags, states } = useContext(TagsContext)
  const [form] = Form.useForm<Store>()
  const handleReset = () => {
    form.resetFields()
    setQuery({}, 'replace')
  }
  const handleSubmit = (values: Store) => {
    if (values.start && values.end) {
      notification.error({
        message: 'Start and End cannot be used together',
        description: 'Firebase es una bosta y no deja filtrar por dos campos con desigualdades',
      })
      return
    }
    if (values.state && values.tags) {
      notification.error({
        message: 'State and Tags cannot be used together',
        description: "Firebase es una bosta y no deja combinar 'in' con 'array-contains-any'",
      })
      return
    }
    setQuery(values, 'replace')
  }
  return (
    <Collapse items={[
      {
        key: '1',
        label: 'Filters',
        children: (
          <Form
            form={form}
            onFinish={handleSubmit}
            layout='vertical'
            initialValues={{
              sortDirection: 'asc',
            }}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={8}>
                <Form.Item name='name' label='Name'>
                  <Input disabled type='text' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item name='start' label='Start'>
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item name='end' label='End'>
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='state' label='State'>
                  <Select mode='tags' allowClear>
                    {states &&
                      Object.keys(states).map((key) => (
                        <Select.Option key={key} value={key}>
                          {key}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='tags' label='Tags'>
                  <Select mode='tags' allowClear>
                    {tags &&
                      Object.keys(tags).map((key) => (
                        <Select.Option key={key} value={key}>
                          {key}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='sortBy' label='Sort by'>
                  <Select allowClear>
                    <Select.Option value='name'>Name</Select.Option>
                    <Select.Option value='start'>Start</Select.Option>
                    <Select.Option value='end'>End</Select.Option>
                    <Select.Option value='state'>State</Select.Option>
                    <Select.Option value='hours'>Hours</Select.Option>
                    <Select.Option value='achievements'>
                      Achievements
                    </Select.Option>
                    <Select.Option value='score'>Score</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='sortDirection' label='Order'>
                  <Select allowClear>
                    <Select.Option value='asc'>Ascending</Select.Option>
                    <Select.Option value='desc'>
                      Descending
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col>
                <Button onClick={handleReset}>Reset</Button>
              </Col>
              <Col>
                <Button htmlType='submit'>Apply</Button>
              </Col>
            </Row>
          </Form>
        )
      }
    ]} />
  )
}
