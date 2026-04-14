import { TrueProgress } from '@/components/ui/TrueProgress'
import { useQuery } from '@/hooks/useFetch'
import { useEffect } from 'react'

function ModStadistics() {
  const { data, fetchData } = useQuery('isaac-mods/aggregates')

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return data ? (
    <TrueProgress
      obtainedActual={data.played}
      obtainedTotal={data.played}
      total={data.total}
    />
  ) : undefined
}

export default ModStadistics
