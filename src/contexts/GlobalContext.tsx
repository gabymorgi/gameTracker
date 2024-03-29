import { query } from '@/hooks/useFetch'
import React, { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'

export type GenericTag = { [key: string]: number }

export type TagType = 'tags' | 'states'

interface IGlobalContext {
  tags?: GenericTag
  states?: GenericTag
  loading: boolean
  upsertVal: (type: TagType, name: { id: string; hue: number }) => Promise<void>
  deleteVal: (type: TagType, name: string) => Promise<void>
  refresh: () => Promise<void>
}

export const GlobalContext = React.createContext<IGlobalContext>(
  {} as IGlobalContext,
)

export const GLobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<{ [key: string]: GenericTag }>()
  const getData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await query<{
        states: { id: string; hue: number }[]
        tags: { id: string; hue: number }[]
      }>('tags/getGlobal')
      const tags: GenericTag = {}
      data.tags.forEach((tag) => {
        tags[tag.id] = tag.hue
      })
      const states: GenericTag = {}
      data.states.forEach((state) => {
        states[state.id] = state.hue
      })
      setValues({ tags, states })
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  const upsertVal = useCallback(
    async (type: TagType, tag: { id: string; hue: number }) => {
      setLoading(true)
      await query(type, 'POST', [tag])
      const copy = { ...values }
      copy[type][tag.id] = tag.hue
      setValues(copy)
      setLoading(false)
    },
    [values],
  )

  const deleteVal = useCallback(
    async (type: TagType, name: string) => {
      setLoading(true)
      await query(`tags/delete/${name}`, 'DELETE', { type })
      const copy = { ...values }
      delete copy[type][name]
      setValues(copy)
      setLoading(false)
    },
    [values],
  )

  return (
    <GlobalContext.Provider
      value={{
        tags: values?.tags,
        states: values?.states,
        loading,
        upsertVal,
        deleteVal,
        refresh: getData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
