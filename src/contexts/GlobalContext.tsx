import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import React, { useCallback, useEffect, useState } from 'react'

export type GenericTag = { [key: string]: number }

interface IGlobalContext {
  tags?: GenericTag
  states?: GenericTag
  loading: boolean
  upsertVal: (
    type: EndPoint.TAGS | EndPoint.STATES,
    name: string,
  ) => Promise<void>
  deleteVal: (
    type: EndPoint.TAGS | EndPoint.STATES,
    name: string
  ) => Promise<void>
}

export const GlobalContext = React.createContext<IGlobalContext>({} as IGlobalContext)

export const GLobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<{ [key: string]: GenericTag }>()
  const getData = useCallback(async () => {
    setLoading(true)
    const data = await query<{
      states: { id: string, hue: number }[],
      tags: { id: string, hue: number }[]
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
    setLoading(false)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  const upsertVal = useCallback(
    async (type: EndPoint.TAGS | EndPoint.STATES, name: string) => {
      setLoading(true)
      await query(type, Options.POST, {}, [{ id: name, hue: 0 }])
      const copy = { ...values }
      copy[type][name] = 0
      setValues(copy)
      setLoading(false)
    }, [values]
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
    [values]
  )

  console.log(values)

  return (
    <GlobalContext.Provider
      value={{
        tags: values?.tags,
        states: values?.states,
        loading,
        upsertVal,
        deleteVal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
