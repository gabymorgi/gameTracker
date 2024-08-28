import { query } from '@/hooks/useFetch'
import React, { useCallback, useEffect, useState } from 'react'

import { App } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'

let message: MessageInstance
let notification: NotificationInstance

export { message, notification }

export type GenericTag = Record<string, number>

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

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const staticFunction = App.useApp()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<Record<string, GenericTag>>()

  useEffect(() => {
    message = staticFunction.message
    notification = staticFunction.notification
  }, [staticFunction.message, staticFunction.notification])

  const getData = useCallback(async () => {
    setLoading(true)
    const data = await query('tags/getGlobal')
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
    async (type: TagType, tag: { id: string; hue: number }) => {
      setLoading(true)
      await query('tags/upsert', { type, data: [tag] })
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
      await query('tags/delete', { type, id: name })
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
