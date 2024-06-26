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

    if (response.status !== 200) {
      console.log('error', response)
      throw new Error(response.statusText)
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error(error.message)
      console.log(error.message)
    }
    throw new Error('Unknown error')
  }
}
