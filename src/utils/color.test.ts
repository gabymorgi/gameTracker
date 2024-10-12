import { describe, it, expect } from 'vitest'
import { findDivisions, findCut } from './color'

describe('findDivisions', () => {
  it('should return the correct divisions', () => {
    expect(findDivisions(5)).toEqual([70, 170, 214, 301])
    expect(findDivisions(6)).toEqual([58, 150, 194, 228, 311])
  })

  it('should return the correct divisions with 180', () => {
    expect(findDivisions(5, 0, 180)).toEqual([36, 59, 96, 153])
    expect(findDivisions(6, 0, 180)).toEqual([33, 52, 76, 133, 158])
  })
})

describe('findCut', () => {
  it('should return the correct cut', () => {
    expect(findCut(0)).toBe(0)
    expect(findCut(0.25)).toBe(92)
    expect(findCut(0.5)).toBe(194)
    expect(findCut(0.75)).toBe(281)
    expect(findCut(1)).toBe(360)
  })
})
