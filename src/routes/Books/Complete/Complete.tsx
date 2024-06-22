import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { App, Button, Form, Spin } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'
import { ChatContext, ChatProvider } from '@/contexts/ChatContext'
import { getGPTMemoText, parseGPTMemo } from '@/utils/gpt'
import { InputMemo } from '@/components/Form/InputMemo'
import { getChangedValues } from '@/utils/getChangedValues'
import { wait } from '@/utils/promise'

function CompleteMemo() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const {
    chatData,
    deleteChat,
    loading: chatLoading,
    sendMessage,
  } = useContext(ChatContext)
  const initialValues = useRef<Memo[]>([] as Memo[])
  const [form] = Form.useForm()

  async function onFinishMemo(values: { memos: Memo[] }) {
    setLoading(true)
    const changedValues = getChangedValues(
      { memos: initialValues.current },
      values,
    )
    if (changedValues?.memos.update.length) {
      for (const memo of changedValues.memos.update) {
        await query('memos/words/upsert', 'PUT', memo)
        message.success(`Updated ${memo.id}`)
        await wait(1000)
      }
    }
    if (changedValues?.memos.delete.length) {
      for (const memoId of changedValues.memos.delete) {
        await query(`memos/words/delete/${memoId}`, 'DELETE')
        message.success(`Deleted ${memoId}`)
        await wait(1000)
      }
    }
    setLoading(false)
    refetch()
  }

  async function refetch() {
    setLoading(true)
    const data = await query<Memo[]>('memos/words/get', 'GET', {
      excludeCompleted: true,
      limit: 6,
    })
    initialValues.current = data
    form.setFieldValue('memos', data)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  async function recursiveGPT(data: Memo[], index: number) {
    if (!data) return
    await wait(1000)

    sendMessage(getGPTMemoText(data[index]), (messages) => {
      const gptObject = parseGPTMemo(messages)
      if (!gptObject) {
        message.error('GPT could not parse the message')
        setLoading(false)
        return
      }

      const newMemos = data.map((memo, i) =>
        i === index
          ? {
              ...memo,
              word: gptObject.word,
              pronunciation: gptObject.pronuntiation,
              definition: gptObject.definitions.join('\n'),
              phrases: gptObject.examples.map((example, i) => ({
                ...memo.phrases[i],
                content: example.english,
                translation: example.spanish,
              })) as any,
            }
          : memo,
      )

      form.setFieldsValue({ memos: newMemos })
      message.success(`GPT success ${index + 1}/${newMemos.length}`)
      if (index < newMemos.length - 1) {
        recursiveGPT(newMemos, index + 1)
      } else {
        setLoading(false)
      }
    })
  }

  async function massiveGPT() {
    setLoading(true)
    const data = form.getFieldValue('memos')
    recursiveGPT(data, 0)
  }

  return (
    <ChatProvider>
      <div className="flex flex-col gap-16">
        <Spin spinning={loading || chatLoading}>
          <div className="flex flex-col gap-16">
            <div className="flex gap-16">
              <h4>runId: {chatData.runId}</h4>
              <h4>threadId: {chatData.threadId}</h4>
            </div>
            <div className="flex gap-16">
              <Button onClick={massiveGPT} type="primary">
                Massive GPT
              </Button>
              <Button onClick={deleteChat} danger type="primary">
                Delete Chat
              </Button>
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinishMemo}
              id="memo-complete"
            >
              <Form.List name="memos">
                {(fields, { remove }, { errors }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Form.Item name={name} key={key}>
                        <InputMemo
                          fieldName={name}
                          remove={() => remove(name)}
                        />
                      </Form.Item>
                    ))}
                    <Form.ErrorList errors={errors} />
                    {/* <Form.Item>
                      <Button
                        type="default"
                        onClick={() => add()}
                        icon={<PlusCircleFilled />}
                      >
                        Add changelog
                      </Button>
                    </Form.Item> */}
                  </>
                )}
              </Form.List>
            </Form>
            <div className="flex gap-16">
              <Button type="primary" htmlType="submit" form="memo-complete">
                Submit
              </Button>
              <Button onClick={refetch} type="primary">
                Refetch
              </Button>
            </div>
          </div>
        </Spin>
      </div>
    </ChatProvider>
  )
}

export default CompleteMemo
