import { DateParam, StringParam } from 'use-query-params'
import { useFilters } from './useFilters'

const filterConfig = {
  from: DateParam,
  to: DateParam,
  name: StringParam,
}

function useChangelogFilters() {
  return useFilters(filterConfig)
}

export default useChangelogFilters
