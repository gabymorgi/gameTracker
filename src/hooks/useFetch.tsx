import { GenericObject } from '@/ts'
import { App, message } from 'antd'
import { useState, useCallback, useEffect } from 'react'

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE'

interface FetchResult<TData> {
  loading: boolean
  data?: TData
  fetchData: (
    method?: HttpMethod,
    options?: GenericObject,
    body?: GenericObject,
  ) => Promise<void>
}

export async function query<TData>(
  path: string,
  method?: HttpMethod,
  queryData?: GenericObject,
): Promise<TData> {
  try {
    const url = '/.netlify/functions/'

    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        Authorization: `${localStorage.getItem('jwt')}`,
      },
    }

    // Construimos los parámetros de la URL solo si el método es GET o HEAD.
    let params = ''
    if (method === 'GET' || method === 'HEAD') {
      params = '?' + new URLSearchParams(queryData).toString()
    } else {
      fetchOptions.body = JSON.stringify(queryData)
    }

    const response = await fetch(`${url}${path}${params}`, fetchOptions)

    if (response.status !== 200) {
      throw new Error(response.statusText)
    }
    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error(error.message)
      throw new Error(error.message)
    }
    throw new Error('Unknown error')
  }
}

export function useLazyFetch<TData>(path: string): FetchResult<TData> {
  const [data, setData] = useState<TData | undefined>()
  const [loading, setLoading] = useState(false)
  const { notification } = App.useApp()

  const fetchData = useCallback(
    async (method?: HttpMethod, queryData?: GenericObject) => {
      setLoading(true)
      try {
        const data = await query<TData>(path, method, queryData)
        setData(data)
      } catch (error: unknown) {
        if (error instanceof Error) {
          notification.error({
            message: 'Error fetching data',
            description: error.message,
          })
        }
      } finally {
        setLoading(false)
      }
    },
    [notification, path],
  )

  return {
    loading,
    data,
    fetchData,
  }
}

export function useFetch<TData>(
  path: string,
  options?: GenericObject,
  body?: GenericObject,
): FetchResult<TData> {
  const { data, loading, fetchData } = useLazyFetch<TData>(path)

  useEffect(() => {
    fetchData('GET', options, body)
  }, [fetchData, options, body])

  return {
    data,
    loading,
    fetchData,
  }
}
