import { useQuery } from '@/hooks/useFetch'
import { Progress } from 'antd'
import { useEffect } from 'react'

function ModStadistics() {
  const { data, fetchData } = useQuery('isaac-mods/statistics')

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return data ? (
    <Progress
      percent={(data.played / data.total) * 100}
      format={() => `${data.played} / ${data.total}`}
    />
  ) : undefined
}

export default ModStadistics
