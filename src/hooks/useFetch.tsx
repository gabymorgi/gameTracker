import { GenericObject } from '@/ts'
import { App, message } from 'antd'
import { useState, useCallback, useEffect } from 'react'

export enum Options {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface FetchResult<TData> {
  loading: boolean
  data?: TData
  fetchData: (
    method?: Options,
    options?: GenericObject,
    body?: GenericObject,
  ) => Promise<void>
}

export async function query<TData>(
  path: string,
  method?: Options,
  options?: GenericObject,
  body?: GenericObject,
): Promise<TData> {
  try {
    const url = '/.netlify/functions/'
    const params = new URLSearchParams(options).toString()
    const response = await fetch(`${url}${path}?${params}`, {
      method: method || Options.GET,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
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
    async (method?: Options, options?: GenericObject, body?: GenericObject) => {
      setLoading(true)
      try {
        const data = await query<TData>(path, method, options, body)
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
    fetchData(Options.GET, options, body)
  }, [fetchData, options, body])

  return {
    data,
    loading,
    fetchData,
  }
}
