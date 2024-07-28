import { round } from './round'

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export function unitBy(input: string, factor: number, roundTo = 3): string {
  const v = Number.parseFloat(input)
  const units = /(px|em|rem|%)$/.exec(input)?.[1] || ''
  return `${round(v * factor, roundTo)}${units}`
}
