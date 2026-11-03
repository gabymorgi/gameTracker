import {
  StringParam,
  ArrayParam,
  withDefault,
  DateParam,
} from 'use-query-params'
import { useFilters } from './useFilters'

const filterConfig = {
  name: StringParam,
  start: DateParam,
  end: DateParam,
  state: StringParam,
  tags: ArrayParam,
  sortBy: withDefault(StringParam, 'end'),
  sortDirection: withDefault(StringParam, 'desc'),
}

function useGameFilters() {
  return useFilters(filterConfig)
}

export default useGameFilters
