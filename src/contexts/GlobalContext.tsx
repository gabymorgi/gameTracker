import { useMutation, useQuery } from '@/hooks/useFetch'
import React, { useEffect, useMemo } from 'react'

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
  upsertVal: (name: { id: string; hue: number }) => void
  deleteVal: (name: string) => void
  refresh: (_: undefined) => void
}

export const GlobalContext = React.createContext<IGlobalContext>(
  {} as IGlobalContext,
)

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const staticFunction = App.useApp()
  const { data, fetchData, loading } = useQuery('tags/get')
  const { mutate: upsertTags, loading: upsertTagsLoading } =
    useMutation('tags/upsert')
  const { mutate: deleteTag, loading: deleteTagLoading } =
    useMutation('tags/delete')

  useEffect(() => {
    message = staticFunction.message
    notification = staticFunction.notification
  }, [staticFunction.message, staticFunction.notification])

  useEffect(() => {
    fetchData(undefined)
  }, [])

  const tags: GenericTag = useMemo(() => {
    const tags: GenericTag = {}
    if (data) {
      data.forEach((tag) => {
        tags[tag.id] = tag.hue
      })
    }
    return tags
  }, [data])

  function deleteVal(name: string) {
    deleteTag({ id: name })
  }

  return (
    <GlobalContext.Provider
      value={{
        tags: tags,
        loading: loading || upsertTagsLoading || deleteTagLoading,
        upsertVal: upsertTags,
        deleteVal,
        refresh: fetchData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
