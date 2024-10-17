import { describe, expect, test } from 'vitest'
import { getChangedValues } from './getChangedValues'

const baseOriginal = {
  id: 'id',
  stringToChange: 'original',
  stringToDelete: 'original',
  numberToChange: 123,
  numberToDelete: 123,
  boolToChange: true,
  boolToDelete: true,
  objectToChange: {
    id: 'objectToChange-id',
    valueToChange: 'value',
    valueToDelete: 'value',
  },
  objectToDelete: {
    id: 'objectToDelete-id',
    value: 'value',
  },
  arrayStringV: ['toDelete', 'toStay'],
  arrayObjV: [
    {
      id: 'arrayObjV-toChange-id',
      valueToChange: 'value',
      valueToDelete: 'value',
    },
    {
      id: 'arrayObjV-toDelete-id',
      value: 'value',
    },
  ],
}

const baseChanged = {
  id: 'id',
  stringToCreate: 'created',
  stringToChange: 'changed',
  numberToCreate: 789,
  numberToChange: 456,
  boolToCreate: false,
  boolToChange: false,
  objectToCreate: {
    id: 'objectCreated-id',
    value: 'value',
  },
  objectToChange: {
    id: 'objectToChange-id',
    valueToCreate: 'created',
    valueToChange: 'changed',
  },
  arrayStringV: ['toStay', 'toCreate'],
  arrayObjV: [
    {
      id: 'arrayObjV-toChange-id',
      valueToCreate: 'create',
      valueToChange: 'changed',
    },
    {
      id: 'arrayObjV-toCreate-id',
      value: 'value',
    },
  ],
}

describe('getChangedValues', () => {
  test('when objects are equal', () => {
    expect(getChangedValues(baseOriginal, baseOriginal)).toBe(undefined)
  })

  test('when objects are different', () => {
    const expectedObj = {
      __action__: 'update',
      id: 'id',
      stringToChange: 'changed',
      stringToCreate: 'created',
      numberToChange: 456,
      numberToCreate: 789,
      boolToChange: false,
      boolToCreate: false,
      objectToCreate: {
        __action__: 'create',
        id: 'objectCreated-id',
        value: 'value',
      },
      objectToChange: {
        __action__: 'update',
        id: 'objectToChange-id',
        valueToCreate: 'created',
        valueToChange: 'changed',
      },
      objectToDelete: {
        __action__: 'delete',
        id: 'objectToDelete-id',
      },
      arrayObjV: {
        create: [
          {
            __action__: 'create',
            id: 'arrayObjV-toCreate-id',
            value: 'value',
          },
        ],
        delete: ['arrayObjV-toDelete-id'],
        update: [
          {
            __action__: 'update',
            id: 'arrayObjV-toChange-id',
            valueToChange: 'changed',
            valueToCreate: 'create',
          },
        ],
      },
      arrayStringV: {
        create: ['toCreate'],
        delete: ['toDelete'],
        update: [],
      },
    }
    expect(getChangedValues(baseOriginal, baseChanged)).toEqual(expectedObj)
  })
})
