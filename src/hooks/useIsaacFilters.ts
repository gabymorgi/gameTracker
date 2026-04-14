import {
  StringParam,
  ArrayParam,
  withDefault,
  BooleanParam,
} from 'use-query-params'
import { useFilters } from './useFilters'

const filterConfig = {
  sortDirection: StringParam,
  filter: ArrayParam,
  contentType: withDefault(StringParam, 'CHARACTER'),
  playedAt: withDefault(BooleanParam, false),
  appId: StringParam,
}

function useIsaacFilters() {
  return useFilters(filterConfig)
}

export default useIsaacFilters
