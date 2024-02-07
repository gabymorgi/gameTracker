import { GenericObject } from '@/ts'

const isObject = (obj: any) => obj && typeof obj === 'object'

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
  const changedValues = Object.keys(current).reduce(
    (acc: GenericObject, key) => {
      if (Array.isArray(original[key]) && Array.isArray(current[key])) {
        const arrayChanges = compareArrays(original[key], current[key])
        if (
          arrayChanges.create.length > 0 ||
          arrayChanges.update.length > 0 ||
          arrayChanges.delete.length > 0
        ) {
          acc[key] = arrayChanges
        }
      } else if (isObject(original[key]) && isObject(current[key])) {
        const changes = getChangedValues(original[key], current[key])
        if (changes) {
          acc[key] = changes
        }
      } else if (original[key] !== current[key]) {
        acc[key] = current[key]
      }
      return acc
    },
    {},
  )
  if (Object.keys(changedValues).length > 0) {
    // add the id to the object
    changedValues.id = current.id
    return changedValues
  } else {
    return undefined
  }
}
