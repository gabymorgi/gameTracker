import { Button, Flex, Form, Input, InputNumber, Space } from 'antd'
import { mdiClose, mdiContentSave } from '@mdi/js'
import { Icon } from '@/components/ui/Icon'
import { InputHours } from '@/components/Form/InputHours'
import DatePicker from '@/components/ui/DatePicker'
import styled from 'styled-components'
import { InputState } from '@/components/Form/InputState'
import { Changelog } from '#prisma-browser-client'
import { useEffect, useRef } from 'react'

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
  changelog: Changelog
  onFinish: (values: Changelog) => void
  onCancel: () => void
}

const ChangelogItemInput = (props: ChangelogItemInputPropsI) => {
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [])

  return (
    <div ref={formRef} className="w-full">
      <Form
        className="w-full justify-between"
        id="changelog-item-form"
        layout="inline"
        initialValues={props.changelog}
        onFinish={props.onFinish}
      >
        <FlexFormContainer gap="small">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="createdAt" rules={[{ required: true }]}>
            <DatePicker picker="month" suffixIcon />
          </Form.Item>
          <Form.Item name="achievements" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="state" rules={[{ required: true }]}>
            <InputState suffix />
          </Form.Item>
          <Form.Item name="playedTime" rules={[{ required: true }]}>
            <InputHours />
          </Form.Item>
        </FlexFormContainer>
        <Space.Compact>
          <Button
            type="primary"
            icon={<Icon path={mdiContentSave} />}
            htmlType="submit"
            form="changelog-item-form"
          />
          <Button
            type="default"
            danger
            icon={<Icon path={mdiClose} />}
            onClick={props.onCancel}
          />
        </Space.Compact>
      </Form>
    </div>
  )
}

export default ChangelogItemInput
