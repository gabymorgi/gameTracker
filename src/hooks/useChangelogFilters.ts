import { DateParam } from 'use-query-params'
import { useFilters } from './useFilters'

const filterConfig = {
  from: DateParam,
  to: DateParam,
}

function useChangelogFilters() {
  return useFilters(filterConfig)
}

export default useChangelogFilters
