import { describe, expect, test } from 'vitest'
import { getChangedValues } from './getChangedValues'
import exampleFixture from '@mocks/example.json'

describe('getChangedValues', () => {
  test('when objects are equal', () => {
    expect(getChangedValues(exampleFixture, exampleFixture)).toBe(undefined)
  })

  // base types
    // has additional key
    // has fewer keys
    // has different key values
  // object types
    // has additional shallow object
    // has fewer shallow object
    // has additional keys inner object
  // has fewer keys inner object
  // has different key values inner object
  // has additional array
  // has fewer array
})
