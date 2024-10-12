import { describe, it, expect } from 'vitest'
import {
  formatPlayedTime,
  formatQueryParams,
  formattedDate,
  formattedPathName,
} from './format'

describe('formatPlayedTime', () => {
  it('should return hh:mm when receiving a number', () => {
    expect(formatPlayedTime(123)).toBe('2:03')
  })

  it('should return no data when number is 0', () => {
    expect(formatPlayedTime(0)).toBe('no data')
  })
})

describe('formattedDate', () => {
  it('should return a human readable string when receiving a Date', () => {
    expect(formattedDate(new Date('2021-09-03'))).toBe('Sep 2021')
  })
})

describe('formattedPathName', () => {
  it('should return an array with the name when receiving a string', () => {
    expect(formattedPathName('name')).toEqual(['name'])
  })

  it('should return an empty array when receiving undefined', () => {
    expect(formattedPathName(undefined)).toEqual([])
  })

  it('should return the array when receiving an array', () => {
    expect(formattedPathName(['name', 'path'])).toEqual(['name', 'path'])
  })
})

describe('formatQueryParams', () => {
  it('should return an object without empty values', () => {
    expect(
      formatQueryParams({
        a: 1,
        b: '',
        c: null,
        d: undefined,
        e: false,
        f: 0,
      }),
    ).toEqual({ a: 1, e: false, f: 0 })
  })
})
