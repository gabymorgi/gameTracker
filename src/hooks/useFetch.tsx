import { message } from '@/contexts/GlobalContext'
import { $SafeAny } from '@/ts'
import {
  ApiCrudPaths,
  ApiPaginablePaths,
  ApiPaths,
  HttpMethod,
  MutationPaths,
  QueryPaths,
} from '@/ts/api'
import { formatQueryParams } from '@/utils/format'
import { parseISO } from 'date-fns'
import { useEffect, useRef, useState } from 'react'

function parseAPIResponse(obj: $SafeAny) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].match(/\d{4}-\d{2}-\d{2}/)) {
      obj[key] = parseISO(obj[key])
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recurse into object
      parseAPIResponse(obj[key])
    }
  }
}

async function query<TPath extends keyof ApiPaths>(
  path: TPath,
  method: HttpMethod,
  queryData: ApiPaths[TPath]['params'],
): Promise<ApiPaths[TPath]['response']> {
  try {
    const url = `/.netlify/functions/${path}`

    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        Authorization: `${localStorage.getItem('jwt')}`,
      },
    }

    if (queryData) {
      // set params on body for every method
      fetchOptions.body = JSON.stringify(queryData)
    }

    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    if (response.status !== 200) {
      throw new Error(data.message || response.statusText)
    }
    parseAPIResponse(data)
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      message.error(error.message, 5)
      throw error
    } else {
      message.error('Unknown error')
      throw new Error('Unknown error')
    }
  }
}

interface UseQueryReturn<TPath extends keyof QueryPaths> {
  data?: QueryPaths[TPath]['response']
  fetchData: (queryData: QueryPaths[TPath]['params']) => Promise<void>
  loading: boolean
}

export function useQuery<TPath extends keyof QueryPaths>(
  path: TPath,
): UseQueryReturn<TPath> {
  const [data, setData] = useState<QueryPaths[TPath]['response']>()
  const [loading, setLoading] = useState(true)

  async function fetchData(queryData: QueryPaths[TPath]['params']) {
    setLoading(true)
    try {
      const res = await query(path, 'GET', queryData)
      setData(res)
    } catch (error) {
      // handled by query
    } finally {
      setLoading(false)
    }
  }

  return { data, fetchData, loading }
}

export function useEagerQuery<TPath extends keyof QueryPaths>(
  path: TPath,
  queryData: QueryPaths[TPath]['params'],
): UseQueryReturn<TPath> {
  const { data, loading, fetchData } = useQuery(path)

  useEffect(() => {
    fetchData(queryData)
  }, [])

  return { data, loading, fetchData }
}

interface UseMutationReturn<TPath extends keyof MutationPaths> {
  mutate: (
    queryData: MutationPaths[TPath]['params'],
  ) => Promise<MutationPaths[TPath]['response']>
  loading: boolean
}

export function useMutation<TPath extends keyof MutationPaths>(
  path: TPath,
): UseMutationReturn<TPath> {
  const [loading, setLoading] = useState(true)

  async function mutate(
    queryData: MutationPaths[TPath]['params'],
  ): Promise<MutationPaths[TPath]['response']> {
    setLoading(true)
    try {
      const res = await query(path, 'POST', queryData)
      return res
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading }
}

type CrudKeys = 'games'

export function usePaginatedFetch<TEntity extends CrudKeys>(entity: TEntity) {
  const unsynchronizedIds = useRef<string[]>([])
  const skip = useRef(0)
  const pageSize = 24
  const [data, setData] = useState<QueryPaths[`${TEntity}/get`]['response']>([])
  const [loading, setLoading] = useState(true)
  const [isMore, setIsMore] = useState(true)
  const queryData = useRef<QueryPaths[`${TEntity}/get`]['params']>()

  async function fetchData() {
    setLoading(true)
    try {
      const res = await query(`${entity}/get`, 'GET', {
        skip: skip.current,
        take: pageSize,
        gameId: '',
        ...queryData.current,
      })
      const filteredRes = res.filter(
        (item: { id: string }) => !unsynchronizedIds.current.includes(item.id),
      )
      skip.current += pageSize
      setData((prev) => [...prev, ...filteredRes])
      setIsMore(filteredRes.length === pageSize)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function reset(newQueryData: ApiCrudPaths[TEntity]['get']['params']) {
    queryData.current = newQueryData
    skip.current = 0
    setData([])
    fetchData()
  }

  async function addValue(newItem: ApiCrudPaths[TEntity]['create']['params']) {
    const res = await query<`${TEntity}/create`>(
      `${entity}/create`,
      'POST',
      newItem,
    )
    unsynchronizedIds.current.push(res.id)
    setData((prev) => [...prev, res])
  }

  async function updateValue(
    id: string,
    newItem: ApiPaths[`${TEntity}/update`]['response'],
  ) {
    const res = await query(`${entity}/update`, 'PUT', { id, ...newItem })
    const newData = data.map((item) => (item.id === id ? res : item))
    setData(newData)
  }

  async function deleteValue(id: string) {
    await query(`${entity}/delete`, 'DELETE', { id })
    const newData = data.filter((item) => item.id !== id)
    skip.current -= 1
    setData(newData)
  }

  return {
    data,
    loading,
    fetchData,
    reset,
    isMore,
    addValue,
    updateValue,
    deleteValue,
  }
}
