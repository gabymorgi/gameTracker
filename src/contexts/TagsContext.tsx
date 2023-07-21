import React, { useCallback, useEffect, useState } from 'react'
import { updateItem } from '@/back/bdUtils'

export type GenericTag = { [key: string]: number }

interface ITagsContext {
  tags?: GenericTag
  states?: GenericTag
  loading: boolean
  createVal: (
    collectionName: any, //CollectionType,
    name: string,
    hue: number
  ) => Promise<void>
  updateVal: (
    collectionName: any, //CollectionType,
    name: string,
    hue: number
  ) => Promise<void>
  deleteVal: (collectionName: any, name: string) => Promise<void>//CollectionType, name: string) => Promise<void>
}

export const TagsContext = React.createContext<ITagsContext>({} as ITagsContext)

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<{ [key: string]: GenericTag }>()
  const getTags = useCallback(async () => {
    setLoading(true)
    // let data = await getDocs(collection(db, CollectionType.Tags))
    // const tags: GenericTag = {}
    // data.docs.forEach((doc) => {
    //   const data = doc.data() as any
    //   tags[doc.id] = data.hue
    // })

    // data = await getDocs(collection(db, CollectionType.States))
    // const states: GenericTag = {}
    // data.docs.forEach((doc) => {
    //   const data = doc.data() as any
    //   states[doc.id] = data.hue
    // })
    // setValues({ tags, states })
    setLoading(false)
  }, [])

  useEffect(() => {
    getTags()
  }, [getTags])

  const createVal = async (
    collectionName: any, // CollectionType,
    name: string,
    hue: number
  ) => {
    setLoading(true)
    // await setDoc(doc(db, collectionName, name), { hue })
    const copy = { ...values }
    copy[collectionName][name] = hue
    setValues(copy)
    setLoading(false)
  }

  const updateVal = useCallback(
    async (collectionName: any, name: string, hue: number) => { //CollectionType, name: string, hue: number) => {
      setLoading(true)
      // await updateItem(collectionName, name, { hue })
      const copy = { ...values }
      copy[collectionName][name] = hue
      setValues(copy)
      setLoading(false)
    },
    [values]
  )

  const deleteVal = useCallback(
    async (collectionName: any, name: string) => {// CollectionType, name: string) => {
      setLoading(true)
      // const statesDoc = doc(db, collectionName, name)
      // await deleteDoc(statesDoc)
      const copy = { ...values }
      delete copy[collectionName][name]
      setValues(copy)
      setLoading(false)
    },
    [values]
  )

  return (
    <TagsContext.Provider
      value={{
        tags: values?.tags,
        states: values?.states,
        loading,
        createVal,
        updateVal,
        deleteVal,
      }}
    >
      {children}
    </TagsContext.Provider>
  )
}
