import { message } from '@/contexts/GlobalContext'
import { $SafeAny } from '@/ts'
import { ApiPaths, HttpMethod } from '@/ts/api'
import { IdParams } from '@/ts/api/common'
import { parseISO } from 'date-fns'
import { useRef, useState } from 'react'

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

export async function query<TPath extends keyof ApiPaths>(
  path: TPath,
  method: HttpMethod,
  queryData: ApiPaths[TPath]['params'],
): Promise<ApiPaths[TPath]['response']> {
  try {
    const url = `/.netlify/functions/${path}`

    const fetchOptions: RequestInit = {
      method: method || 'POST',
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

interface UseQueryReturn<TPath extends keyof ApiPaths> {
  data?: ApiPaths[TPath]['response']
  fetchData: (queryData: ApiPaths[TPath]['params']) => Promise<void>
  loading: boolean
}

export function useQuery<TPath extends keyof ApiPaths>(
  path: TPath,
): UseQueryReturn<TPath> {
  const [data, setData] = useState<ApiPaths[TPath]['response']>()
  const [loading, setLoading] = useState(false)

  async function fetchData(queryData: ApiPaths[TPath]['params']) {
    setLoading(true)
    try {
      const res = await query(path, 'POST', queryData)
      setData(res)
    } catch (error) {
      // handled by query
    } finally {
      setLoading(false)
    }
  }

  return { data, fetchData, loading }
}

interface UseMutationReturn<TPath extends keyof ApiPaths> {
  mutate: (
    queryData: ApiPaths[TPath]['params'],
  ) => Promise<ApiPaths[TPath]['response']>
  loading: boolean
}

export function useMutation<TPath extends keyof ApiPaths>(
  path: TPath,
): UseMutationReturn<TPath> {
  const [loading, setLoading] = useState(false)

  async function mutate(
    queryData: ApiPaths[TPath]['params'],
  ): Promise<ApiPaths[TPath]['response']> {
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

type CrudKeys = 'books' | 'changelogs' | 'games' | 'isaac-mods'

export function usePaginatedFetch<TEntity extends CrudKeys>(entity: TEntity) {
  const unsynchronizedIds = useRef<Set<string>>(new Set())
  const skip = useRef(0)
  const pageSize = 24
  const [data, setData] = useState<IdParams[]>([])
  const [loading, setLoading] = useState(true)
  const [isMore, setIsMore] = useState(true)
  const queryData = useRef<ApiPaths[`${TEntity}/get`]['params']>()

  async function fetchData() {
    setLoading(true)
    try {
      const res = await query(`${entity}/get`, 'POST', {
        ...queryData.current,
        skip: skip.current,
        take: pageSize,
      })
      const filteredRes = res.filter((item: { id: string }) => {
        if (unsynchronizedIds.current.has(item.id)) {
          unsynchronizedIds.current.delete(item.id)
          return false
        }
        return true
      })
      skip.current += pageSize
      setData((prev) => [...prev, ...filteredRes])
      setIsMore(filteredRes.length === pageSize)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function reset(newQueryData: ApiPaths[`${TEntity}/get`]['params']) {
    queryData.current = newQueryData
    skip.current = 0
    setData([])
    fetchData()
  }

  async function addValue(newItem: ApiPaths[`${TEntity}/create`]['params']) {
    const res = await query<`${TEntity}/create`>(
      `${entity}/create`,
      'POST',
      newItem,
    )
    unsynchronizedIds.current.add(res.id)
    setData((prev) => [res, ...prev])
  }

  async function updateValue(newItem: ApiPaths[`${TEntity}/update`]['params']) {
    const res = await query(`${entity}/update`, 'PUT', newItem)
    const newData = data.map((item) => (item.id === res.id ? res : item))
    setData(newData)
  }

  async function deleteValue(id: string) {
    await query(`${entity}/delete`, 'DELETE', { id })
    const newData = data.filter((item) => item.id !== id)
    skip.current -= 1
    setData(newData)
  }

  return {
    data: data as ApiPaths[`${TEntity}/get`]['response'],
    loading,
    nextPage: fetchData,
    reset,
    isMore,
    addValue,
    updateValue,
    deleteValue,
  }
}
