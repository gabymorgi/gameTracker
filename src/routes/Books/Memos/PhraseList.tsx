import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import { Button, Card, Spin, Form, Select, Input } from 'antd'
import { Phrase } from '@prisma/client'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import freq from '@/utils/freq.json'
import { Store } from 'antd/es/form/interface'

const freqData: { [key: string]: number } = freq

function getPhrasesText(phrases?: Phrase[]) {
  return phrases?.map((phrase) => `- ${phrase.content}`).join('\n') ?? ''
}

function WordList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Phrase[]>()

  async function refetch() {
    setLoading(true)
    const data = await query<Phrase[]>(EndPoint.PHRASES)
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  async function handleFinish(values: Store) {
    values.words =
      values.words?.map((word: string) => ({
        value: word,
        priority: Number(freqData[word] || 0) + 4,
      })) ?? []
    await query(EndPoint.PHRASES, Options.PUT, {}, values)
    setData((prev) => prev?.filter((phrase) => phrase.id !== values.id))
  }

  async function handleDelete(id: string) {
    await query(EndPoint.PHRASES, Options.DELETE, { id })
    setData((prev) => prev?.filter((phrase) => phrase.id !== id))
  }

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col gap-16">
        <CopyToClipboard text={getPhrasesText(data)}>
          <Button>Copy phrases</Button>
        </CopyToClipboard>
        {data?.map((phrase) => (
          <Card key={phrase.id}>
            {phrase.content}
            {phrase.translation}
            <Form initialValues={phrase} onFinish={handleFinish}>
              <Form.Item hidden name="id">
                <Input />
              </Form.Item>
              <Form.Item name="translation">
                <TextArea placeholder="Translation" autoSize={{ minRows: 3 }} />
              </Form.Item>
              <Form.Item name="words">
                <Select mode="tags" allowClear />
              </Form.Item>
              <div className="flex justify-between">
                <Button danger onClick={() => handleDelete(phrase.id)}>
                  Delete
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Card>
        ))}
        <Button onClick={refetch}>Refetch</Button>
      </div>
    </Spin>
  )
}

export default WordList
