// @vitest-environment jsdom
import { Paginable } from '@/ts/api/common'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePaginatedFetch } from './useFetch'
import { GameCreateInput, GameUpdateInput } from '@/ts/api/games'

interface TestItem {
  id: string
  name: string
}

function createTestItems(): TestItem[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `id-${i + 1}`,
    name: `Item ${i + 1}`,
  }))
}

function mockFetchWithData<T extends { id: string }>(initialItems: T[]) {
  let items = [...initialItems]

  return vi.fn(async (url: RequestInfo | URL, options?: RequestInit) => {
    const path = String(url)
    const body = JSON.parse(String(options?.body))

    if (path.endsWith('/get')) {
      const { skip = 0, take = items.length } = body as Paginable
      return {
        status: 200,
        json: async () => items.slice(skip, skip + take),
      } as Response
    }

    if (path.endsWith('/create')) {
      const newItem = body as T
      items = [...items, newItem].sort((a, b) => a.id.localeCompare(b.id))
      return { status: 200, json: async () => newItem } as Response
    }

    if (path.endsWith('/update')) {
      const updatedItem = body as T
      items = items.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
      )
      return { status: 200, json: async () => updatedItem } as Response
    }

    if (path.endsWith('/delete')) {
      const { id } = body as { id: string }
      items = items.filter((item) => item.id !== id)
      return { status: 200, json: async () => ({ id }) } as Response
    }

    throw new Error(`Unhandled mock fetch path: ${path}`)
  })
}

function getRequestBody(fetchMock: ReturnType<typeof mockFetchWithData>) {
  return JSON.parse(
    String(fetchMock.mock.lastCall?.[1]?.body),
  ) as Required<Paginable>
}

describe('usePaginatedFetch', () => {
  let testItems: TestItem[]
  let fetchMock: ReturnType<typeof mockFetchWithData<TestItem>>

  beforeEach(() => {
    testItems = createTestItems()
    fetchMock = mockFetchWithData(testItems)
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches the first page of data', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
      ])
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.isMore).toBe(true)
  })

  it('appends the next page and increments the skip param', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })

    await act(async () => {
      result.current.nextPage()
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-3',
        'id-4',
      ])
    })
    expect(getRequestBody(fetchMock).skip).toBe(2)
    expect(result.current.isMore).toBe(true)
  })

  it('sets isMore to false when a page returns fewer items than pageSize', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 4))

    await act(async () => {
      result.current.reset({})
    })
    await act(async () => {
      result.current.nextPage()
    })

    await waitFor(() => expect(result.current.data).toHaveLength(5))
    expect(result.current.isMore).toBe(false)
  })

  it('resets back to the first page when query data changes', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })
    await act(async () => {
      result.current.nextPage()
    })
    await waitFor(() => expect(result.current.data).toHaveLength(4))

    await act(async () => {
      result.current.reset({})
    })

    await waitFor(() => expect(result.current.data).toHaveLength(2))
    expect(getRequestBody(fetchMock).skip).toBe(0)
    expect(result.current.isMore).toBe(true)
  })

  it('adds a new item to the end of the list', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })

    await act(async () => {
      result.current.addValue({
        id: 'id-9',
        name: 'Item 9',
      } as unknown as GameCreateInput)
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-9',
      ])
    })

    await act(async () => {
      result.current.nextPage()
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-9',
        'id-3',
        'id-4',
      ])
    })
  })

  it('adds a new item to the end of the list and next page has the added item', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 3))

    await act(async () => {
      result.current.reset({})
    })

    await act(async () => {
      result.current.addValue({
        id: 'id-9',
        name: 'Item 9',
      } as unknown as GameCreateInput)
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-3',
        'id-9',
      ])
    })

    await act(async () => {
      result.current.nextPage()
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-3',
        'id-9',
        'id-4',
        'id-5',
      ])
    })
  })

  it('adds a new item to the beginning of the list', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })

    await act(async () => {
      result.current.addValue({
        id: 'id-0',
        name: 'Item 0',
      } as unknown as GameCreateInput)
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-0',
      ])
    })

    await act(async () => {
      result.current.nextPage()
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-1',
        'id-2',
        'id-0',
        'id-3',
      ])
    })
  })

  it('updates an existing item in the list', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })

    await act(async () => {
      result.current.updateValue({
        id: 'id-1',
        name: 'Updated Item 1',
      } as unknown as GameUpdateInput)
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.name)).toEqual([
        'Updated Item 1',
        'Item 2',
      ])
    })
  })

  it('deletes an item from the list', async () => {
    const { result } = renderHook(() => usePaginatedFetch('games', 2))

    await act(async () => {
      result.current.reset({})
    })

    await act(async () => {
      result.current.deleteValue('id-1')
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual(['id-2'])
    })

    await act(async () => {
      result.current.nextPage()
    })

    await waitFor(() => {
      expect(result.current.data.map((item) => item.id)).toEqual([
        'id-2',
        'id-3',
        'id-4',
      ])
    })
  })
})
