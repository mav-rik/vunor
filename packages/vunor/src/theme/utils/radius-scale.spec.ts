import { describe, expect, it } from 'vitest'

import { computeRadiusScale } from './radius-scale'

import type { TRadiusScale } from './radius-scale'

describe('computeRadiusScale', () => {
  const cases: Array<{ base: string; expected: TRadiusScale }> = [
    {
      base: '0',
      expected: { r0: '0', r1: '0', r2: '0', r3: '0', r4: '0' },
    },
    {
      base: '2px',
      expected: { r0: '2px', r1: '2px', r2: '3px', r3: '4px', r4: '5px' },
    },
    {
      base: '4px',
      expected: { r0: '2px', r1: '4px', r2: '6px', r3: '8px', r4: '10px' },
    },
    {
      base: '8px',
      expected: { r0: '4px', r1: '8px', r2: '12px', r3: '16px', r4: '20px' },
    },
    {
      base: '16px',
      expected: { r0: '4px', r1: '16px', r2: '24px', r3: '32px', r4: '40px' },
    },
    {
      base: '0.618em',
      expected: {
        r0: '4px',
        r1: '0.618em',
        r2: '0.927em',
        r3: '1.236em',
        r4: '1.545em',
      },
    },
    {
      base: '1em',
      expected: { r0: '4px', r1: '1em', r2: '1.5em', r3: '2em', r4: '2.5em' },
    },
    {
      base: '0.5rem',
      expected: {
        r0: '4px',
        r1: '0.5rem',
        r2: '0.75rem',
        r3: '1rem',
        r4: '1.25rem',
      },
    },
  ]

  for (const { base, expected } of cases) {
    it(`emits correct scale for baseRadius=${base}`, () => {
      expect(computeRadiusScale(base)).toEqual(expected)
    })
  }

  it('falls back to CSS expressions for unparseable inputs', () => {
    expect(computeRadiusScale('var(--x)')).toEqual({
      r0: 'min(var(--x), clamp(2px, calc(var(--x) / 2), 4px))',
      r1: 'var(--x)',
      r2: 'calc(var(--x) * 1.5)',
      r3: 'calc(var(--x) * 2)',
      r4: 'calc(var(--x) * 2.5)',
    })
  })

  it('treats bare numbers as px', () => {
    const result = computeRadiusScale('8')
    expect(result.r0).toBe('4px')
    expect(result.r1).toBe('8')
    expect(result.r2).toBe('12px')
  })

  it('single-knob contract: baseRadius=0 collapses every token', () => {
    const result = computeRadiusScale('0')
    for (const key of ['r0', 'r1', 'r2', 'r3', 'r4'] as const) {
      expect(result[key]).toBe('0')
    }
  })

  it('r0 is always px for non-zero parseable inputs', () => {
    for (const base of ['2px', '8px', '0.618em', '1em', '0.5rem']) {
      const r0 = computeRadiusScale(base).r0
      expect(r0.endsWith('px')).toBe(true)
    }
  })
})
