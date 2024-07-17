import { useMemo } from 'react'
import {
  useQueryParams,
  StringParam,
  ArrayParam,
  withDefault,
  DateParam,
} from 'use-query-params'

function removeEmpty<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ''),
  )
}

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
    return removeEmpty(queryParams)
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}

export default useBookFilters
