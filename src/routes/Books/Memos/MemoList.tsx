import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import { Memo } from '@/ts/books'
import { Button, Spin } from 'antd'
import { useEffect, useState } from 'react'
import MemoCard from '../Training/MemoCard'

function MemoList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Memo[]>()

  async function refetch() {
    setLoading(true)
    const data = await query<Memo[]>(EndPoint.WORDS, Options.GET, {
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
    <>
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
    </>
  )
}

export default MemoList
