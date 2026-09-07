import { describe, expect, it } from 'vitest'
import { calculateBookChangelogs } from './bookChangelogCalculator'

describe('calculateBookChangelogs', () => {
  it('groups multiple days within the same month into a single changelog', () => {
    const result = calculateBookChangelogs({
      start: new Date(2026, 2, 1),
      end: new Date(2026, 2, 10),
      words: 100,
    })

    expect(result).toHaveLength(1)
    expect(result[0].words).toBe(100)
  })

  it('splits words across changelogs when the interval spans multiple months', () => {
    const result = calculateBookChangelogs({
      start: new Date(2026, 2, 27),
      end: new Date(2026, 3, 5),
      words: 100,
    })

    expect(result).toHaveLength(2)
    expect(result[0].createdAt).toEqual(new Date(Date.UTC(2026, 2, 1, 12)))
    expect(result[1].createdAt).toEqual(new Date(Date.UTC(2026, 3, 1, 12)))
    expect(result[0].words).toBe(50)
    expect(result[1].words).toBe(50)
  })
})
