import { describe, it, expect } from 'vitest'
import { formatPlayedTime } from './format'

describe('sum function', () => {
  it('should return the sum of two numbers', () => {
    expect(formatPlayedTime(123)).toBe('2:03')
  })
})
