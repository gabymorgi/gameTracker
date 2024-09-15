import { formatQueryParams } from '@/utils/format'
import { useMemo } from 'react'
import {
  useQueryParams,
  StringParam,
  ArrayParam,
  withDefault,
  DateParam,
} from 'use-query-params'

function useBookFilters() {
  const [queryParams, setQueryParams] = useQueryParams({
    name: StringParam,
    start: DateParam,
    end: DateParam,
    state: ArrayParam,
    language: ArrayParam,
    sortBy: withDefault(StringParam, 'end'),
    sortDirection: withDefault(StringParam, 'desc'),
  })

  const parsedQueryParams = useMemo(() => {
    return formatQueryParams(queryParams)
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}

export default useBookFilters
