import { StringParam, ArrayParam, withDefault } from 'use-query-params'
import { useFilters } from './useFilters'

const defaultFilters = ['characters', 'not-played']

const filterConfig = {
  sortBy: withDefault(StringParam, 'end'),
  sortDirection: StringParam,
  filter: withDefault(ArrayParam, defaultFilters),
  appId: StringParam,
}

function useIsaacFilters() {
  return useFilters(filterConfig)
}

export default useIsaacFilters
