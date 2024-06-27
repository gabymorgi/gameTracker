import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, InputNumber, InputProps } from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { Memo } from '@/ts/books'
import { getGPTMemoText } from '@/utils/gpt'

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

interface InputMemoProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: Partial<Memo>
  onChange?: (value: Partial<Memo>) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputMemo(props: InputMemoProps) {
  const fieldNames = formattedPathName(props.fieldName)

  function handleChangeGPT(gptString: string) {
    try {
      const gptObject = JSON.parse(gptString) as GPTObject
      props.onChange?.({
        ...props.value,
        pronunciation: gptObject.pronuntiation,
        definition: gptObject.definitions.join('\n'),
        phrases: gptObject.examples.map((example) => ({
          content: example.english,
          translation: example.spanish,
        })) as Memo['phrases'],
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(getGPTMemoText(props.value as Memo))
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <Card
      title={props.value?.value}
      extra={
        <div className="flex gap-16">
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={copyToClipboard}
          />
          {props.remove && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={props.remove}
            >
              Remove
            </Button>
          )}
        </div>
      }
    >
      <Form.Item name={[...fieldNames, 'id']} hidden>
        <Input />
      </Form.Item>
      <Input.TextArea
        placeholder="Chat GPT answer"
        onChange={(e) => handleChangeGPT(e.target.value)}
      />
      <Form.Item label="Word" name={[...fieldNames, 'word']}>
        <Input />
      </Form.Item>
      <Form.Item label="Pronunciation" name={[...fieldNames, 'pronunciation']}>
        <Input />
      </Form.Item>
      <Form.Item label="Definition" name={[...fieldNames, 'definition']}>
        <Input.TextArea autoSize={{ minRows: 3 }} placeholder="Definition" />
      </Form.Item>
      <Form.List name={[...fieldNames, 'phrases']}>
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
      <Form.Item label="Priority" name={[...fieldNames, 'priority']}>
        <InputNumber />
      </Form.Item>
    </Card>
  )
}