import { formatQueryParams } from '@/utils/format'
import { useMemo } from 'react'
import { useQueryParams, DateParam } from 'use-query-params'

function useChangelogFilters() {
  const [queryParams, setQueryParams] = useQueryParams({
    from: DateParam,
    to: DateParam,
  })

  const parsedQueryParams = useMemo(() => {
    return formatQueryParams(queryParams)
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}

export default useChangelogFilters
