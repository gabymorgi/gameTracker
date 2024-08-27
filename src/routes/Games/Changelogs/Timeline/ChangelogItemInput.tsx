import { Button, Card, Flex, Form, Input, InputNumber, Space } from 'antd'
import { CloseOutlined, SaveFilled } from '@ant-design/icons'
import { InputHours } from '@/components/Form/InputHours'
import DatePicker from '@/components/ui/DatePicker'
import styled from 'styled-components'
import { ChangelogI } from '@/ts/game'
import { InputState } from '@/components/Form/InputState'
import InputSearchGame from '@/components/Form/InputSearchGame'

const FlexFormContainer = styled(Flex)`
  .ant-form-item {
    margin-inline-end: 0;
  }

  .ant-picker {
    width: 100px;
  }
  .ant-input-number {
    width: 50px;
  }
  .ant-select-single.ant-select-show-arrow .ant-select-selection-item {
    padding-inline-end: 0;
  }
`

interface ChangelogItemInputPropsI {
  changelog: ChangelogI
  onFinish: (values: ChangelogI) => void
  onCancel: () => void
}

const ChangelogItemInput = (props: ChangelogItemInputPropsI) => {
  return (
    <Card size="small">
      <Form
        className="w-full justify-between items-center"
        id="changelog-item-form"
        layout="inline"
        initialValues={props.changelog}
        onFinish={props.onFinish}
      >
        <FlexFormContainer vertical gap="middle">
          <Flex gap="middle">
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>
            <Form.Item name="gameId" rules={[{ required: true }]}>
              <InputSearchGame />
            </Form.Item>
            <Form.Item name="stateId" rules={[{ required: true }]}>
              <InputState suffixIcon />
            </Form.Item>
          </Flex>
          <Flex gap="middle">
            <Form.Item name="createdAt" rules={[{ required: true }]}>
              <DatePicker picker="month" suffixIcon />
            </Form.Item>
            <Form.Item name="achievements" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name="hours" rules={[{ required: true }]}>
              <InputHours />
            </Form.Item>
          </Flex>
        </FlexFormContainer>
        <Space.Compact>
          <Button
            type="primary"
            icon={<SaveFilled />}
            htmlType="submit"
            form="changelog-item-form"
          />
          <Button
            type="default"
            danger
            icon={<CloseOutlined />}
            onClick={props.onCancel}
          />
        </Space.Compact>
      </Form>
    </Card>
  )
}

export default ChangelogItemInput
