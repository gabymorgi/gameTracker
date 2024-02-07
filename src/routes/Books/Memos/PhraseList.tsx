import { query } from '@/hooks/useFetch'
import { Button, Spin, List } from 'antd'
import { Phrase } from '@prisma/client'
import { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'

function WordList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Phrase[]>()

  async function refetch() {
    setLoading(true)
    const data = await query<Phrase[]>('memos/phrases/get')
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  async function handleDelete(id: string) {
    await query(`memos/phrases/delete/${id}`, 'DELETE')
    setData((prev) => prev?.filter((phrase) => phrase.id !== id))
  }

  return (
    <Spin spinning={loading}>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        loadMore={<Button onClick={refetch}>Refetch</Button>}
        dataSource={data}
        renderItem={(phrase) => (
          <List.Item
            key={phrase.id}
            actions={[
              <Button
                key={phrase.id}
                danger
                onClick={() => handleDelete(phrase.id)}
                icon={<DeleteOutlined />}
              />,
            ]}
          >
            <div>{phrase.content}</div>
          </List.Item>
        )}
      />
    </Spin>
  )
}

export default WordList
