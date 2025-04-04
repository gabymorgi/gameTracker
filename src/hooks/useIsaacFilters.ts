import { formatQueryParams } from '@/utils/format'
import { useMemo } from 'react'
import {
  useQueryParams,
  StringParam,
  ArrayParam,
  withDefault,
} from 'use-query-params'

const defaultFilters = ['characters', 'not-played']

function useIsaacFilters() {
  const [queryParams, setQueryParams] = useQueryParams({
    sortBy: withDefault(StringParam, 'end'),
    sortDirection: StringParam,
    filter: withDefault(ArrayParam, defaultFilters),
    appId: StringParam,
  })

  const parsedQueryParams = useMemo(() => {
    return formatQueryParams(queryParams)
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}

export default useIsaacFilters
