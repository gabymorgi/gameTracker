import { formatQueryParams } from '@/utils/format'
import { useMemo } from 'react'
import { useQueryParams, StringParam, ArrayParam } from 'use-query-params'

function useIsaacFilters() {
  const [queryParams, setQueryParams] = useQueryParams({
    sortDirection: StringParam,
    filter: ArrayParam,
    appId: StringParam,
  })

  const parsedQueryParams = useMemo(() => {
    return formatQueryParams(queryParams)
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}

export default useIsaacFilters
