import { Button, Flex, Form } from 'antd'
import { query } from '@/hooks/useFetch'
import { useEffect, useRef } from 'react'
import { getChangedValues } from '@/utils/getChangedValues'
import { InputMemo } from '@/components/Form/InputMemo'
import { Word } from '@/ts/api/words'

interface EditingCardProps {
  isNew?: boolean
  memo: Word
  handleDelete?: () => void
  handleEdit: (memo: Word) => void
  handleClose: () => void
}

function EditingCard(props: EditingCardProps) {
  const initialValues = useRef(props.isNew ? {} : props.memo)
  const [form] = Form.useForm()

  async function onFinishMemo(values: { memo: Word }) {
    const changedValues = getChangedValues(initialValues.current, values.memo)
    if (changedValues) {
      await query('words/update', changedValues)
    }
    props.handleEdit(values.memo)
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
        <InputMemo fieldName="memo" />
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
