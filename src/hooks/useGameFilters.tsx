import { useMemo } from 'react'
import {
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  withDefault,
} from 'use-query-params'

function removeEmpty(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ''),
  )
}

function useGameFilters() {
  const [query, setQuery] = useQueryParams({
    name: StringParam,
    start: NumberParam,
    end: NumberParam,
    state: ArrayParam,
    tags: ArrayParam,
    sortBy: withDefault(StringParam, 'end'),
    sortDirection: withDefault(StringParam, 'desc'),
  })

  const parsedQuery = useMemo(() => {
    return removeEmpty(query)
  }, [query])

  return { query: parsedQuery, setQuery}
}

export default useGameFilters
