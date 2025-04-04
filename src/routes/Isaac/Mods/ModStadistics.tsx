import Spin from '@/components/ui/Spin'
import { useQuery } from '@/hooks/useFetch'
import { Progress } from 'antd'
import { useEffect } from 'react'

function ModStadistics() {
  const { data, fetchData, loading } = useQuery('isaac-mods/aggregates')

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Spin spinning={loading}>
      {data ? (
        <Progress
          format={() => `${data.played} / ${data.total}`}
          percent={(data.played / data.total) * 100}
          percentPosition={{ align: 'center', type: 'inner' }}
          size={{
            height: 20,
          }}
          strokeColor="hsl(180, 80%, 30%)"
        />
      ) : undefined}
    </Spin>
  )
}

export default ModStadistics
