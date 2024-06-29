import { Memo } from '@/ts/books'
import { Button, Flex, Form } from 'antd'
import { query } from '@/hooks/useFetch'
import { useEffect, useRef } from 'react'
import { getChangedValues } from '@/utils/getChangedValues'
import { InputMemo } from '@/components/Form/InputMemo'

interface EditingCardProps {
  memo: Memo
  handleDelete?: () => void
  handleEdit: (memo: Memo) => void
  handleClose: () => void
}

function EditingCard(props: EditingCardProps) {
  const initialValues = useRef(props.memo)
  const [form] = Form.useForm()

  async function onFinishMemo(values: Memo) {
    const changedValues = getChangedValues(initialValues.current, values)
    if (changedValues) {
      await query('words/upsert', changedValues)
    }
    props.handleEdit(values)
    props.handleClose()
  }

  useEffect(() => {
    form.setFieldsValue(props.memo)
  }, [props.memo, form])

  return (
    <Form
      layout="vertical"
      initialValues={{ memo: props.memo }}
      onFinish={onFinishMemo}
      form={form}
    >
      <Form.Item name="memo">
        <InputMemo />
      </Form.Item>
      <Flex gap="middle">
        <Button
          key="delete"
          disabled={!props.handleDelete}
          danger
          onClick={props.handleDelete}
        >
          Delete
        </Button>
        <Button key="cancel" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button key="save" type="primary" htmlType="submit">
          Save
        </Button>
      </Flex>
    </Form>
  )
}

export default EditingCard
