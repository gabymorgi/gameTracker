import { GenericObject } from '@/ts'

const isObject = (obj: any) => obj && typeof obj === 'object'
const isDate = (value: any): value is Date => value instanceof Date

const compareArrays = (
  originalArr: Array<GenericObject>,
  currentArr: Array<GenericObject>,
) => {
  const changes: {
    create: Array<GenericObject>
    update: Array<GenericObject>
    delete: Array<string>
  } = {
    create: [],
    update: [],
    delete: [],
  }

  if (isObject(originalArr[0])) {
    const currentIds = new Set(currentArr.map((item) => item.id))
    const originalIds = new Set(originalArr.map((item) => item.id))

    // Detectar creaciones y actualizaciones
    for (const item of currentArr) {
      if (!originalIds.has(item.id)) {
        changes.create.push(getChangedValues({}, item) || item)
      } else {
        const originalItem = originalArr.find((o) => o.id === item.id)
        if (!originalItem) continue
        const updatedItem = getChangedValues(originalItem, item)
        if (updatedItem) {
          changes.update.push({ id: item.id, ...updatedItem })
        }
      }
    }

    // Detectar eliminaciones
    for (const item of originalArr) {
      if (!currentIds.has(item.id)) {
        changes.delete.push(item.id)
      }
    }

    return changes
  } else {
    const currentIds = new Set(currentArr)
    const originalIds = new Set(originalArr)

    // Detectar creaciones y actualizaciones
    for (const item of currentArr) {
      if (!originalIds.has(item)) {
        changes.create.push(item)
      }
    }

    // Detectar eliminaciones
    for (const item of originalArr) {
      if (!currentIds.has(item)) {
        changes.delete.push(item as unknown as string)
      }
    }

    return changes
  }
}

export const getChangedValues = (
  original: GenericObject,
  current: GenericObject,
) => {
  if (original && !current) {
    return { id: original.id, __action__: 'delete' } // Añade esto si el current es undefined y el original existe
  }
  const action = original && current.id ? 'update' : 'create'
  if (!original) {
    original = {}
  }

  const keys = new Set([...Object.keys(original), ...Object.keys(current)])
  const changedValues = Array.from(keys).reduce((acc: GenericObject, key) => {
    if (isDate(original[key]) || isDate(current[key])) {
      if (original[key]?.getTime() !== current[key]?.getTime()) {
        acc[key] = current[key]
      }
    } else if (Array.isArray(original[key]) || Array.isArray(current[key])) {
      const arrayChanges = compareArrays(
        original[key] || [],
        current[key] || [],
      )
      if (
        arrayChanges.create.length > 0 ||
        arrayChanges.update.length > 0 ||
        arrayChanges.delete.length > 0
      ) {
        acc[key] = arrayChanges
      }
    } else if (isObject(original[key]) || isObject(current[key])) {
      const changes = getChangedValues(original[key], current[key])
      if (changes) {
        acc[key] = changes
      }
    } else if (original[key] !== current[key]) {
      acc[key] = current[key]
    }
    return acc
  }, {})

  if (Object.keys(changedValues).length > 0) {
    // add the id and action to the object
    changedValues.id = current.id
    changedValues.__action__ = action
    return changedValues
  } else {
    return undefined
  }
}
