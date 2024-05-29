import { query } from '@/hooks/useFetch'
import { Memo } from '@/ts/books'
import { Button, Spin } from 'antd'
import { useEffect, useState } from 'react'
import MemoCard from '../Training/MemoCard'
import { ChatProvider } from '@/contexts/ChatContext'

function CompleteMemo() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Memo[]>()

  async function refetch() {
    setLoading(true)
    const data = await query<Memo[]>('memos/words/get', 'GET', {
      excludeCompleted: true,
      limit: 6,
    })
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  const handleDelete = async (id: string) => {
    setData((prev) => prev?.filter((memo) => memo.id !== id))
  }

  return (
    <ChatProvider>
      <div className="flex flex-col gap-16">
        <Spin spinning={loading}>
          <div className="flex flex-col gap-16">
            {data?.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                handleDelete={handleDelete}
                handleEdit={(memo) => handleDelete(memo.id)}
              />
            ))}
          </div>
          <Button onClick={refetch} type="primary">
            Refetch
          </Button>
        </Spin>
      </div>
    </ChatProvider>
  )
}

export default CompleteMemo
