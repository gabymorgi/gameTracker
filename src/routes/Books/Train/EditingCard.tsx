import { Memo } from '@/ts/books'
import { Button, Card, Form, Input, InputNumber, Tag, message } from 'antd'
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import { query } from '@/hooks/useFetch'
import { useContext, useMemo, useRef } from 'react'
import { ChatContext } from '@/contexts/ChatContext'
import { getChangedValues } from '@/utils/getChangedValues'
import { GPTObject, getGPTMemoText, parseGPTMemo } from '@/utils/gpt'

interface EditingCardProps {
  memo: Memo
  handleDelete?: () => void
  handleEdit: (memo: Memo) => void
  handleClose: () => void
}

function EditingCard(props: EditingCardProps) {
  const { loading, sendMessage } = useContext(ChatContext)
  const initialValues = useRef(props.memo)
  const [form] = Form.useForm()

  async function onFinishMemo(values: Memo) {
    const changedValues = getChangedValues(initialValues.current, values)
    if (changedValues) {
      await query('words/upsert', 'PUT', changedValues)
    }
    props.handleEdit(values)
    props.handleClose()
  }

  const formId = useMemo(() => Math.random().toString(36).substring(2, 11), [])

  function handleChangeGPT(gptObject: GPTObject) {
    try {
      form.setFieldValue('word', gptObject.word)
      form.setFieldValue('pronunciation', gptObject.pronuntiation)
      form.setFieldValue('definition', gptObject.definitions.join('\n'))
      form.setFieldValue(
        'phrases',
        gptObject.examples.map((example) => ({
          content: example.english,
          translation: example.spanish,
        })),
      )
    } catch (error) {
      console.error(error)
    }
  }

  function handleSendMessage() {
    if (sendMessage) {
      const memo = form.getFieldsValue()
      sendMessage(getGPTMemoText(memo), (messages) => {
        const gptObject = parseGPTMemo(messages)
        if (!gptObject) {
          message.error('GPT could not parse the message')
          return
        }
        handleChangeGPT(gptObject)
      })
    }
  }

  return (
    <Card
      title={props.memo.word}
      extra={
        <div className="flex gap-8">
          <Tag>Priority {props.memo.priority}</Tag>
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={async () => {
              const memo = form.getFieldsValue()
              try {
                await navigator.clipboard.writeText(getGPTMemoText(memo))
              } catch (error: any) {
                console.error(error.message)
              }
            }}
          />
        </div>
      }
      actions={[
        <Button
          key="delete"
          disabled={!props.handleDelete}
          danger
          onClick={props.handleDelete}
        >
          Delete
        </Button>,
        <Button key="cancel" onClick={props.handleClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" htmlType="submit" form={formId}>
          Save
        </Button>,
        <Button
          key="gpt"
          color="blue"
          onClick={handleSendMessage}
          loading={loading}
          disabled={!sendMessage}
        >
          GPT
        </Button>,
      ]}
    >
      <Form
        id={formId}
        layout="vertical"
        initialValues={props.memo}
        onFinish={onFinishMemo}
        form={form}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <TextArea
          placeholder="Chat GPT answer"
          onChange={(e) => handleChangeGPT(JSON.parse(e.target.value))}
        />
        <Form.Item label="Word" name="word">
          <Input />
        </Form.Item>
        <Form.Item label="Pronunciation" name="pronunciation">
          <Input />
        </Form.Item>
        <Form.Item label="Definition" name="definition">
          <TextArea autoSize={{ minRows: 3 }} placeholder="Definition" />
        </Form.Item>
        <Form.List name="phrases">
          {(fields, { add, remove }, { errors }) => (
            <div className="flex flex-col gap-16">
              {fields.map(({ key, name }) => (
                <Card key={key}>
                  <Form.Item name={[name, 'id']} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={[name, 'content']} label="Content">
                    <Input />
                  </Form.Item>
                  <Form.Item name={[name, 'translation']} label="Translation">
                    <Input />
                  </Form.Item>
                  <Button
                    className="absolute top-0 right-0"
                    danger
                    type="default"
                    onClick={() => remove(name)}
                    icon={<DeleteOutlined />}
                  />
                </Card>
              ))}
              <Form.ErrorList errors={errors} />
              <Form.Item>
                <Button
                  type="default"
                  onClick={() => add()}
                  icon={<EditOutlined />}
                >
                  Add phrase
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.Item label="Priority" name="priority">
          <InputNumber />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default EditingCard
