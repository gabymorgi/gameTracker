import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { Affix, Button, Flex, Form, Spin, Statistic } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'
import { ChatContext } from '@/contexts/ChatContext'
import { getGPTMemoText, getPlaygroundUrl, parseGPTMemo } from '@/utils/gpt'
import { InputMemo } from '@/components/Form/InputMemo'
import { getChangedValues } from '@/utils/getChangedValues'
import { wait } from '@/utils/promise'
import { apiToMemo } from '@/utils/format'
import { message } from '@/contexts/GlobalContext'

function CompleteMemo() {
  const [loading, setLoading] = useState(false)
  const {
    threadId,
    messagesCount,
    createThread,
    deleteThread,
    loading: chatLoading,
    sendMessage,
  } = useContext(ChatContext)
  const initialValues = useRef<Memo[]>([])
  const [form] = Form.useForm()

  async function onFinishMemo(values: { memos: Memo[] }) {
    setLoading(true)
    const changedValues = getChangedValues(
      { memos: initialValues.current },
      values,
    )
    if (changedValues?.memos.update.length) {
      for (const memo of changedValues.memos.update) {
        await query('words/upsert', memo)
        message.success(`Updated ${memo.id}`)
        await wait(1000)
      }
    }
    if (changedValues?.memos.delete.length) {
      for (const memoId of changedValues.memos.delete) {
        await query('words/delete', { id: memoId })
        message.success(`Deleted ${memoId}`)
        await wait(1000)
      }
    }
    setLoading(false)
    refetch()
  }

  async function refetch() {
    setLoading(true)
    const data = (
      await query('words/get', {
        excludeCompleted: true,
        limit: 6,
      })
    ).map(apiToMemo)
    initialValues.current = data
    form.setFieldValue('memos', data)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function recursiveGPT(data: Memo[], index: number) {
    if (!data) return
    await wait(1000)

    sendMessage(getGPTMemoText(data[index]), (res) => {
      if (res.status === 'failed') {
        message.error('GPT failed')
        setLoading(false)
        return
      }
      const gptObject = parseGPTMemo(res.messages)
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
              })),
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
    <Flex vertical gap="middle">
      <Spin spinning={loading || chatLoading} fullscreen />
      <Flex justify="space-between" gap="middle" align="center">
        <Flex gap="middle">
          <Statistic title="Messages" value={messagesCount} />
          <Statistic
            title={
              <a
                target="_blank"
                rel="noreferrer"
                href={threadId ? getPlaygroundUrl(threadId) : ''}
              >
                Thread
              </a>
            }
            value={threadId || '-'}
          />
        </Flex>
        <Flex gap="middle">
          <Button onClick={createThread} type="primary">
            Create Thread
          </Button>
          <Button onClick={deleteThread} danger type="default">
            Delete Thread
          </Button>
        </Flex>
      </Flex>
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
                  <InputMemo fieldName={name} remove={() => remove(name)} />
                </Form.Item>
              ))}
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>
      </Form>
      <Affix offsetBottom={0}>
        <Flex gap="middle" align="center" className="p-middle blur">
          <Button onClick={massiveGPT} type="primary">
            Complete with GPT
          </Button>
          <Button onClick={refetch} type="default">
            Refetch
          </Button>
          <Button type="primary" htmlType="submit" form="memo-complete">
            Submit
          </Button>
        </Flex>
      </Affix>
    </Flex>
  )
}

export default CompleteMemo
