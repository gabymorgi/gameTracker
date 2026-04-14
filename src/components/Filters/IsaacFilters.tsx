import useIsaacFilters from '@/hooks/useIsaacFilters'
import { DeleteOutlined } from '@ant-design/icons'
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
import { useState } from 'react'

const options = [
  { label: 'Items', value: 'items' },
  { label: 'Enemies', value: 'enemies' },
  { label: 'QoL', value: 'qol' },
]

export const ModFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useIsaacFilters()
  const [isAppId, setIsAppId] = useState(!!queryParams.appId)
  const [form] = Form.useForm<Store>()
  const handleReset = () => {
    form.resetFields()
    setQueryParams({}, 'replace')
  }
  const handleSubmit = (values: Store) => {
    if (values.appId) {
      setQueryParams(
        {
          appId: values.appId,
          sortDirection: values.sortDirection,
        },
        'replace',
      )
    } else {
      setQueryParams(values, 'replace')
    }
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
          <Col span={4}>
            <Form.Item name="sortDirection" label="Sort">
              <Select
                allowClear
                options={[
                  { value: 'asc', label: 'Date Ascending' },
                  { value: 'desc', label: 'Date Descending' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="contentType" label="Type">
              <Select
                disabled={isAppId}
                allowClear
                options={[
                  { value: 'CHARACTER', label: 'Character' },
                  { value: 'CHALLENGE', label: 'Challenge' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="playedAt" label="Played">
              <Select
                disabled={isAppId}
                allowClear
                options={[
                  { value: true, label: 'Played' },
                  { value: false, label: 'Not played' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="filter" label="Filter">
              <Checkbox.Group disabled={isAppId} options={options} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="appId"
              label={
                <>
                  <span>App Id</span>&nbsp;
                  <DeleteOutlined
                    onClick={() => {
                      form.setFieldsValue({ appId: undefined })
                      setIsAppId(false)
                    }}
                  />
                </>
              }
            >
              <InputNumber
                min={0}
                className="w-full"
                onChange={(value) => {
                  setIsAppId(!!value)
                }}
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
    </Card>
  )
}
