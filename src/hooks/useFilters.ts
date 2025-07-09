import { useMemo, useRef } from 'react'
import {
  useQueryParams,
  QueryParamConfigMap,
  DecodedValueMap,
} from 'use-query-params'

function deepEqual(a: unknown, b: unknown): boolean {
  // Si son estrictamente iguales, listo
  if (a === b) return true

  // Si son arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  return false
}

export function useFilters<T extends QueryParamConfigMap>(
  paramConfig: T,
): {
  queryParams: DecodedValueMap<T>
  setQueryParams: ReturnType<typeof useQueryParams<T>>[1]
} {
  const [queryParams, setQueryParams] = useQueryParams(paramConfig)

  const lastParsed = useRef<typeof queryParams>(queryParams)

  const parsedQueryParams = useMemo(() => {
    const formatted = queryParams
    const prev = lastParsed.current
    const keys = Object.keys(formatted) as (keyof T)[]

    // key length is always the same, undefine when not set
    for (const key of keys) {
      if (!deepEqual(formatted[key], prev[key])) {
        lastParsed.current = formatted
        return formatted
      }
    }

    return lastParsed.current
  }, [queryParams])

  return { queryParams: parsedQueryParams, setQueryParams }
}
