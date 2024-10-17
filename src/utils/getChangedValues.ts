import { GenericObject } from '@/ts'
import { CRUDArray, UpdateParams } from '@/ts/api/common'

const isObject = (obj: unknown) => obj && typeof obj === 'object'
const isDate = (value: unknown): value is Date => value instanceof Date

const VariableTypes = {
  OBJECT: 'object',
  DATE: 'date',
  ARRAY: 'array',
  OTHER: 'other',
}

function getVariableType(value1: unknown, value2: unknown) {
  const valueToCompare = value1 || value2
  if (isDate(valueToCompare)) {
    return VariableTypes.DATE
  } else if (Array.isArray(valueToCompare)) {
    return VariableTypes.ARRAY
  } else if (isObject(valueToCompare)) {
    return VariableTypes.OBJECT
  } else {
    return VariableTypes.OTHER
  }
}

function compareArrays<T>(
  originalArr: GenericObject[],
  currentArr: GenericObject[],
): CRUDArray<T> {
  const changes: CRUDArray<GenericObject> = {
    create: [],
    update: [],
    delete: [],
  }

  const type = getVariableType(originalArr[0], currentArr[0])

  if (type === VariableTypes.OBJECT) {
    const currentIds = new Set(currentArr.map((item) => item.id))
    const originalIds = new Set(originalArr.map((item) => item.id))

    // Detectar creaciones y actualizaciones
    for (const item of currentArr) {
      if (!originalIds.has(item.id)) {
        changes.create.push(getChangedValues(undefined, item) || item)
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
  }
  return changes as CRUDArray<T>
}

export function getChangedValues<T>(
  original: GenericObject | undefined,
  current: GenericObject,
): UpdateParams<T> {
  if (original && !current) {
    return { id: original.id, __action__: 'delete' } as UpdateParams<T>
  }
  const action = original && current.id ? 'update' : 'create'
  if (!original) {
    original = {}
  }

  const keys = new Set([...Object.keys(original), ...Object.keys(current)])
  const changedValues = Array.from(keys).reduce((acc: GenericObject, key) => {
    const type = getVariableType(original[key], current[key])
    switch (type) {
      case VariableTypes.DATE:
        if (original[key]?.getTime() !== current[key]?.getTime()) {
          acc[key] = current[key]
        }
        break
      case VariableTypes.ARRAY:
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
        break
      case VariableTypes.OBJECT:
        const changes = getChangedValues(original[key], current[key])
        if (changes) {
          acc[key] = changes
        }
        break
      default:
        if (original[key] !== current[key]) {
          acc[key] = current[key]
        }
        break
    }
    return acc
  }, {})

  if (Object.keys(changedValues).length > 0) {
    // add the id and action to the object
    changedValues.id = current.id
    changedValues.__action__ = action
    return changedValues
  } else {
    return undefined as unknown as UpdateParams<T>
  }
}
