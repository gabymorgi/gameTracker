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
  language: ArrayParam,
  sortBy: withDefault(StringParam, 'end'),
  sortDirection: withDefault(StringParam, 'desc'),
}

function useBookFilters() {
  return useFilters(filterConfig)
}

export default useBookFilters
