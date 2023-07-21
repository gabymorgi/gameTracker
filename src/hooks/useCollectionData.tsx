import { useState } from 'react'
import { App } from 'antd'
import { createItem, deleteItem, updateItem } from '@/back/bdUtils'
import useDeepCompareEffect from './useDeepCompareEffect'
import useDeepCompareCallback from './useDeepCompareCallback'

type WhereFilterOp = any
type CollectionType = any
type DocumentData = any
type CollectionReference<T> = any

const DEFAULT_PAGE_SIZE = 24
const inequalityOperators = ['<', '<=', '!=', 'not-in', '>', '>=']

type QueryResult<T> = {
  data: T[]
  isLoading: boolean
  isLastPage: boolean
  getNextPage: (reset?: boolean) => Promise<void>
  addItem: (values: any) => Promise<void>
  editItem: (id: string, values: any) => Promise<void>
  delItem: (id: string) => Promise<void>
}

export interface Order {
  field: string
  direction: 'asc' | 'desc'
}

export interface Filter {
  field: string
  operator: WhereFilterOp
  value: any
}

type TWithId<T> = T & { id: string }

export function useQuery<T>(
  collectionName: CollectionType,
  pageSize: number = DEFAULT_PAGE_SIZE,
  order?: Order,
  filters?: Filter[]
): QueryResult<TWithId<T>> {
  const { notification } = App.useApp();
  // set of new documents IDs to avoid duplicates
  const [newDocumentIds, setNewDocumentIds] = useState<Set<string>>(new Set())
  const [data, setData] = useState<TWithId<T>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLastPage, setIsLastPage] = useState(false)
  const [lastVisible, setLastVisible] = useState<DocumentData>()

  const getNextPage = useDeepCompareCallback(async (reset?: boolean) => {
    if (!reset && (isLoading || isLastPage)) {
      notification.warning({
        message: 'No se puede cargar más',
        description: `Reset: ${reset}, isLoading: ${isLoading}, isLastPage: ${isLastPage}`,
      })
      return
    }
    setIsLoading(true)
    // const collectionRef: CollectionReference<T> = collection(
    //   db,
    //   collectionName
    // ) as CollectionReference<T>
    // const queryConstrains = [
    //   limit(pageSize),
    // ]
    const orderByFields: Order[] = []
    if (filters) {
      filters.forEach((filter) => {
        // queryConstrains.push(where(filter.field, filter.operator, filter.value))
        if (
          inequalityOperators.includes(filter.operator) &&
          !orderByFields.some((order) => order.field === filter.field)
        ) {
          orderByFields.push({
            field: filter.field,
            direction: 'asc', //filter.operator.includes('<') ? 'desc' : 'asc',
          })
        }
      })
    }
    if (order && !orderByFields.some((orderF) => orderF.field === order.field)) {
      orderByFields.push(order)
    }

    orderByFields.forEach((order) => {
      // queryConstrains.push(orderBy(order.field, order.direction))
    })

    if (!reset && lastVisible) {
      // queryConstrains.push(startAfter(lastVisible))
    }
    // const q = query(
    //   collectionRef,
    //   ...queryConstrains
    // )
    try {
      // const querySnapshot = await getDocs(q)

      // const newData: TWithId<T>[] = querySnapshot.docs
      //   .filter((doc) => !newDocumentIds.has(doc.id)) // Filtrar documentos ya en data
      //   .map((doc) => ({ ...doc.data(), id: doc.id }))
      // if (reset) {
      //   setData(newData)
      //   setNewDocumentIds(new Set())
      // } else {
      //   setData([...data, ...newData])
      // }
      // const lastDoc =
      //   querySnapshot.docs[querySnapshot.docs.length - 1]
      // setLastVisible(lastDoc)
      // setIsLoading(false)
      // setIsLastPage(querySnapshot.docs.length < pageSize)
    } catch (error: any) {
      notification.error({
        message: 'Error fetching documents',
        description: error.message,
      })
      setIsLoading(false)
    }
  }, [isLoading, isLastPage, collectionName, pageSize, filters, order, lastVisible, newDocumentIds, data])

  useDeepCompareEffect(() => {
    getNextPage(true)
  }, [filters, order])

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      // const newItemRef = await createItem(collectionName, item)
      // const newItem = { ...item, id: newItemRef.id } as TWithId<T>
      // setNewDocumentIds((prevIds) => {
      //   const newIds = new Set(prevIds)
      //   newIds.add(newItem.id)
      //   return newIds
      // })
      // setData((prevData) => [...prevData, newItem])
      // notification.success({
      //   message: 'Item added',
      //   description: `Added item ${newItem.id}`,
      // })
    } catch (error: any) {
      notification.success({
        message: 'Error adding document',
        description: error.message,
      })
    }
  }

  const editItem = async (id: string, values: any) => {
    try {
      // await updateItem(collectionName, id, values)
      const newData = [...data]
      const index = newData.findIndex((item) => item.id === id)
      newData[index] = { ...newData[index], ...values }
      setData(newData)
      notification.success({
        message: 'Item updated',
        description: `Updated item ${id}`,
      })
    } catch (error: any) {
      notification.error({
        message: 'Error updating document',
        description: `Se edito el item ${id}`,
      })
    }
  }

  const delItem = async (id: string) => {
    try {
      // deleteItem(collectionName, id)
      const newData = [...data]
      const index = newData.findIndex((item) => item.id === id)
      newData.splice(index, 1)
      setData(newData)
      notification.success({
        message: 'Item deleted',
        description: `Deleted item ${id}`,
      })
    } catch (error: any) {
      notification.success({
        message: 'Error deleting document',
        description: error.message,
      })
    }
  }

  return {
    data,
    isLoading,
    isLastPage,
    getNextPage,
    addItem,
    editItem,
    delItem,
  }
}
