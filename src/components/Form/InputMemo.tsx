import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'
import { Button, Card, Flex, Form, Input, InputNumber, InputProps } from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { Memo } from '@/ts/books'
import { getGPTMemoText, GPTObject } from '@/utils/gpt'

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
    await navigator.clipboard.writeText(getGPTMemoText(props.value as Memo))
  }

  async function pasteFromClipboard() {
    const text = await navigator.clipboard.readText()
    handleChangeGPT(text)
  }

  return (
    <Card title={props.value?.value} size="small">
      <Flex gap="middle" className="absolute top-0 right-0">
        <Button icon={<SnippetsOutlined />} onClick={pasteFromClipboard} />
        <Button
          type="primary"
          icon={<CopyOutlined />}
          onClick={copyToClipboard}
        />
        {props.remove && (
          <Button danger icon={<DeleteOutlined />} onClick={props.remove} />
        )}
      </Flex>
      <Form.Item name={[...fieldNames, 'id']} hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Word" name={[...fieldNames, 'value']}>
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
          <Flex vertical gap="middle">
            {fields.map(({ key, name }) => (
              <Card key={key} size="small">
                <Form.Item name={[name, 'id']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={[name, 'content']} label="Content">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name={[name, 'translation']} label="Translation">
                  <Input.TextArea />
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
          </Flex>
        )}
      </Form.List>
      <Form.Item label="Priority" name={[...fieldNames, 'priority']}>
        <InputNumber />
      </Form.Item>
    </Card>
  )
}
