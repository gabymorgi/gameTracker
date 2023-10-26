import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import React, { useCallback, useEffect, useState } from 'react'
import defaultValues from '@/back/global.json'
import { message } from 'antd'

export type GenericTag = { [key: string]: number }

interface IGlobalContext {
  tags?: GenericTag
  states?: GenericTag
  loading: boolean
  upsertVal: (
    type: EndPoint.TAGS | EndPoint.STATES,
    name: { id: string; hue: number },
  ) => Promise<void>
  deleteVal: (
    type: EndPoint.TAGS | EndPoint.STATES,
    name: string,
  ) => Promise<void>
  refresh: () => Promise<void>
}

export const GlobalContext = React.createContext<IGlobalContext>(
  {} as IGlobalContext,
)

export const GLobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<{ [key: string]: GenericTag }>(
    defaultValues,
  )
  const getData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await query<{
        states: { id: string; hue: number }[]
        tags: { id: string; hue: number }[]
      }>(EndPoint.GLOBAL)
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
    async (
      type: EndPoint.TAGS | EndPoint.STATES,
      tag: { id: string; hue: number },
    ) => {
      setLoading(true)
      await query(type, Options.POST, {}, [tag])
      const copy = { ...values }
      copy[type][tag.id] = tag.hue
      setValues(copy)
      setLoading(false)
    },
    [values],
  )

  const deleteVal = useCallback(
    async (type: EndPoint.TAGS | EndPoint.STATES, name: string) => {
      setLoading(true)
      await query(type, Options.DELETE, {}, { id: name })
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
