import {
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  withDefault,
} from 'use-query-params'
import { Filter, Order } from './useCollectionData'
import { useMemo } from 'react'

function useGameFilters() {
  const [query, setQuery] = useQueryParams({
    name: StringParam,
    start: NumberParam,
    end: NumberParam,
    state: ArrayParam,
    tags: ArrayParam,
    sortBy: withDefault(StringParam, 'end'),
    sortDirection: withDefault(StringParam, 'desc'),
    pageSize: withDefault(NumberParam, 24),
  })

  const queryOrder: Order | undefined = useMemo(() => {
    if (!query.sortBy) return undefined
    return {
      field: query.sortBy,
      direction: query.sortDirection || 'desc',
    } as Order
  }, [query])
  
  const queryFilters: Filter[] = useMemo(() => {
    const filters: Filter[] = []
    if (query.name) {
      filters.push({
        field: 'name',
        operator: '==',
        value: query.name,
      })
    }
    if (query.start) {
      filters.push({
        field: 'start',
        operator: '>=',
        value: query.start
      })
    }
    if (query.end) {
      filters.push({
        field: 'end',
        operator: '<=',
        value: query.end
      })
    }
    if (query.state) {
      filters.push({
        field: 'state',
        operator: 'in',
        value: query.state
      })
    }
    if (query.tags) {
      filters.push({
        field: 'tags',
        operator: 'array-contains-any',
        value: query.tags
      })
    }
    return filters
  }, [query])

  return {query, setQuery, queryOrder, queryFilters, pageSize: query.pageSize}
}

export default useGameFilters
