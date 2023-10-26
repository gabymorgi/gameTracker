import { useMemo } from 'react'
import {
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  withDefault,
} from 'use-query-params'

function removeEmpty<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ''),
  )
}

function useGameFilters() {
  const [queryParams, setQueryParams] = useQueryParams({
    name: StringParam,
    start: NumberParam,
    end: NumberParam,
    state: ArrayParam,
    tags: ArrayParam,
    sortBy: withDefault(StringParam, 'end'),
    sortDirection: withDefault(StringParam, 'desc'),
  })

  const parsedQueryParams = useMemo(() => {
    return removeEmpty(queryParams)
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}

export default useGameFilters
