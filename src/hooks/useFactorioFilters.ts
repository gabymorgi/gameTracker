import { BooleanParam, StringParam } from 'use-query-params'
import { useFilters } from './useFilters'

const filterConfig = {
  name: StringParam,
  type: StringParam,
  playedAt: BooleanParam,
  hideModsWithDependencies: BooleanParam,
}

function useFactorioFilters() {
  return useFilters(filterConfig)
}

export default useFactorioFilters
