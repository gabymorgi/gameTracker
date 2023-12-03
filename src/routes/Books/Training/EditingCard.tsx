import { Memo } from '@/ts/books'
import { Button, Card, Form, Input, InputNumber, Tag } from 'antd'
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useMemo } from 'react'

interface GPTObject {
  word: string
  pronuntiation: string
  priority: number
  definitions: Array<string>
  examples: Array<{
    english: string
    spanish: string
  }>
}

function getGPTMemoText(memo: Memo) {
  return `Puedes generarme una flashcard para '${memo.word}'?${
    memo.phrases.length
      ? ` la encontre en
${memo.phrases.map((phrase) => `- ${phrase.content}`).join('\n')}`
      : ''
  }`
}

interface EditingCardProps {
  memo: Memo
  handleEdit: (memo: Memo) => void
  handleClose: () => void
}

function EditingCard(props: EditingCardProps) {
  const [form] = Form.useForm()
  async function onFinishMemo(values: Memo) {
    await query(EndPoint.WORDS, Options.PUT, {}, values)
    props.handleEdit(values)
    props.handleClose()
  }

  const formId = useMemo(() => Math.random().toString(36).substring(2, 11), [])

  function handleChangeGPT(e: React.ChangeEvent<HTMLTextAreaElement>) {
    try {
      const gptObject = JSON.parse(e.target.value) as GPTObject
      form.setFieldValue('word', gptObject.word)
      form.setFieldValue('pronunciation', gptObject.pronuntiation)
      form.setFieldValue('priority', gptObject.priority * 2)
      form.setFieldValue('definition', gptObject.definitions.join('\n'))
      form.setFieldValue(
        'phrases',
        gptObject.examples.map((example) => ({
          content: example.english,
          translation: example.spanish,
        })),
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card
      title={props.memo.word}
      extra={
        <div className="flex gap-8">
          <Tag>Priority {props.memo.priority}</Tag>
          <CopyToClipboard text={getGPTMemoText(props.memo)}>
            <Button size="small" icon={<CopyOutlined />} />
          </CopyToClipboard>
        </div>
      }
      actions={[
        <Button key="cancel" onClick={props.handleClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" htmlType="submit" form={formId}>
          Save
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
        <TextArea placeholder="Chat GPT answer" onChange={handleChangeGPT} />
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
