import { round } from './round'
import { unitBy } from './unit-by'

const ROOT_FONT_PX = 16

export interface TRadiusScale {
  r0: string
  r1: string
  r2: string
  r3: string
  r4: string
}

interface TParsedRadius {
  n: number
  unit: 'px' | 'em' | 'rem' | ''
}

function parseRadius(input: string): TParsedRadius | null {
  const m = input.trim().match(/^(-?\d*\.?\d+)(px|em|rem)?$/)
  if (!m) {
    return null
  }
  const n = Number.parseFloat(m[1])
  if (!Number.isFinite(n)) {
    return null
  }
  return { n, unit: (m[2] ?? '') as TParsedRadius['unit'] }
}

export function computeRadiusScale(baseRadius: string): TRadiusScale {
  const parsed = parseRadius(baseRadius)

  // Fallback for unparseable inputs (var(...), calc(...), %, etc.)
  if (!parsed) {
    return {
      r0: `min(${baseRadius}, clamp(2px, calc(${baseRadius} / 2), 4px))`,
      r1: baseRadius,
      r2: `calc(${baseRadius} * 1.5)`,
      r3: `calc(${baseRadius} * 2)`,
      r4: `calc(${baseRadius} * 2.5)`,
    }
  }

  const { n, unit } = parsed

  if (n === 0) {
    return { r0: '0', r1: '0', r2: '0', r3: '0', r4: '0' }
  }

  // r0: absolute floor/ceiling — always emitted in px so it does not drift
  // with element font-size (r0's entire purpose is to be context-independent).
  const basePx = unit === 'em' || unit === 'rem' ? n * ROOT_FONT_PX : n
  const r0Px = Math.min(basePx, Math.max(2, Math.min(basePx / 2, 4)))

  // Bare numbers scale as px so unitBy emits a valid CSS length.
  const scaled = unit ? baseRadius : `${n}px`

  return {
    r0: `${round(r0Px, 3)}px`,
    r1: baseRadius,
    r2: unitBy(scaled, 1.5),
    r3: unitBy(scaled, 2),
    r4: unitBy(scaled, 2.5),
  }
}
