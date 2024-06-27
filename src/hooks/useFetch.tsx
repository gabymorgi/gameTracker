import { message } from 'antd'
import { ApiPaths, pathToMethod } from './useFetch.types'
import { GenericObject } from '@/ts'

export async function query<TPath extends keyof ApiPaths>(
  path: TPath,
  queryData?: GenericObject,
): Promise<ApiPaths[TPath]> {
  try {
    let url = `/api/${path}`

    const fetchOptions: RequestInit = {
      method: pathToMethod[path] || 'GET',
      headers: {
        Authorization: `${localStorage.getItem('jwt')}`,
      },
    }

    if (queryData) {
      // set params on URL only for GET and HEAD methods
      if (pathToMethod[path] === 'GET') {
        url += '?' + new URLSearchParams(queryData).toString()
      } else {
        // set params on body for POST and PUT methods
        fetchOptions.body = JSON.stringify(queryData)
      }
    }

    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    if (response.status !== 200) {
      throw new Error(data.message || response.statusText)
    }

    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error(error.message, 5)
      throw error
    } else {
      message.error('Unknown error')
      throw new Error('Unknown error')
    }
  }
}
