import { message } from '@/contexts/GlobalContext'
import { $SafeAny } from '@/ts'
import { ApiPaths } from '@/ts/api'
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
  queryData: ApiPaths[TPath]['params'],
): Promise<ApiPaths[TPath]['response']> {
  try {
    const url = `/.netlify/functions/${path}`

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `${localStorage.getItem('jwt')}`,
      },
    }

    if (queryData) {
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
      const res = await query(path, queryData)
      setData(res)
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
      const res = await query(path, queryData)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading }
}

type ListPaths = {
  [K in keyof ApiPaths]: ApiPaths[K]['response'] extends IdParams[] ? K : never
}[keyof ApiPaths]

type ItemPaths = {
  [K in keyof ApiPaths]: ApiPaths[K]['response'] extends IdParams ? K : never
}[keyof ApiPaths]

type CrudEntity = {
  [K in keyof ApiPaths]: K extends `${infer E}/get` ? E : never
}[keyof ApiPaths] extends infer Entities
  ? {
      [E in Extract<Entities, string>]: `${E}/create` extends ItemPaths
        ? `${E}/update` extends ItemPaths
          ? `${E}/delete` extends keyof ApiPaths
            ? E
            : never
          : never
        : never
    }[Extract<Entities, string>]
  : never

export interface CrudEndpoints<
  TGet extends ListPaths = ListPaths,
  TCreate extends ItemPaths = ItemPaths,
  TUpdate extends ItemPaths = ItemPaths,
  TDelete extends keyof ApiPaths = keyof ApiPaths,
> {
  get: TGet
  create?: TCreate
  update?: TUpdate
  delete?: TDelete
}

export function getCrudEndpoints<TEntity extends CrudEntity>(
  entity: TEntity,
): CrudEndpoints<
  `${TEntity}/get`,
  `${TEntity}/create`,
  `${TEntity}/update`,
  `${TEntity}/delete`
> {
  return {
    get: `${entity}/get`,
    create: `${entity}/create`,
    update: `${entity}/update`,
    delete: `${entity}/delete`,
  }
}

export interface UsePaginatedFetchProps<
  TGet extends ListPaths,
  TCreate extends ItemPaths = never,
  TUpdate extends ItemPaths = never,
  TDelete extends keyof ApiPaths = never,
> {
  pageSize?: number
  endpoints: CrudEndpoints<TGet, TCreate, TUpdate, TDelete>
  getIsMore?: (res: ApiPaths[NoInfer<TGet>]['response']) => boolean
}

type Mutator<TPath extends keyof ApiPaths | undefined> = [TPath] extends [
  keyof ApiPaths,
]
  ? (
      params: ApiPaths[Extract<TPath, keyof ApiPaths>]['params'],
    ) => Promise<void>
  : undefined

export interface UsePaginatedFetchReturn<
  TGet extends ListPaths,
  TCreate extends ItemPaths = never,
  TUpdate extends ItemPaths = never,
  TDelete extends keyof ApiPaths = never,
> {
  data: ApiPaths[TGet]['response']
  loading: boolean
  nextPage: () => Promise<void>
  reset: (queryData: ApiPaths[TGet]['params']) => Promise<void>
  isMore: boolean
  addValue: Mutator<TCreate>
  updateValue: Mutator<TUpdate>
  deleteValue: [TDelete] extends [keyof ApiPaths]
    ? (id: string) => Promise<void>
    : undefined
}

export function usePaginatedFetch<
  TGet extends ListPaths,
  TCreate extends ItemPaths = never,
  TUpdate extends ItemPaths = never,
  TDelete extends keyof ApiPaths = never,
>(
  props: UsePaginatedFetchProps<TGet, TCreate, TUpdate, TDelete>,
): UsePaginatedFetchReturn<TGet, TCreate, TUpdate, TDelete> {
  const { endpoints, pageSize = 24, getIsMore } = props
  const unsynchronizedIds = useRef<Set<string>>(new Set())
  const skip = useRef(0)
  const [data, setData] = useState<IdParams[]>([])
  const [loading, setLoading] = useState(true)
  const [isMore, setIsMore] = useState(true)
  const queryData = useRef<ApiPaths[TGet]['params']>(undefined)

  async function fetchData() {
    setLoading(true)
    try {
      const res = await query(endpoints.get, {
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
      setIsMore(
        getIsMore
          ? getIsMore(filteredRes as ApiPaths[TGet]['response'])
          : filteredRes.length === pageSize,
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function reset(newQueryData: ApiPaths[TGet]['params']) {
    queryData.current = newQueryData
    skip.current = 0
    setData([])
    await fetchData()
  }

  async function addValue(
    newItem: ApiPaths[Extract<TCreate, keyof ApiPaths>]['params'],
  ): Promise<void> {
    const res = await query(
      endpoints.create as Extract<TCreate, keyof ApiPaths>,
      newItem,
    )
    unsynchronizedIds.current.add(res.id) // if the item is sorted later than current
    if (data) {
      unsynchronizedIds.current.add(data.at(-1)!.id) // if the last item is sorted prior than current
    }
    setData((prev) => [...prev, res])
  }

  async function updateValue(
    newItem: ApiPaths[Extract<TUpdate, keyof ApiPaths>]['params'],
  ): Promise<void> {
    const res = await query(
      endpoints.update as Extract<TUpdate, keyof ApiPaths>,
      newItem,
    )
    const newData = data.map((item) => (item.id === res.id ? res : item))
    setData(newData)
  }

  async function deleteValue(id: string) {
    await query(endpoints.delete as Extract<TDelete, keyof ApiPaths>, { id })
    const newData = data.filter((item) => item.id !== id)
    skip.current -= 1
    setData(newData)
  }

  return {
    data: data as ApiPaths[TGet]['response'],
    loading,
    nextPage: fetchData,
    reset,
    isMore,
    addValue: (endpoints.create ? addValue : undefined) as Mutator<TCreate>,
    updateValue: (endpoints.update ? updateValue : undefined) as
      | Mutator<TUpdate>
      | undefined,
    deleteValue: (endpoints.delete ? deleteValue : undefined) as
      | ((id: string) => Promise<void>)
      | undefined,
  } as UsePaginatedFetchReturn<TGet, TCreate, TUpdate, TDelete>
}
