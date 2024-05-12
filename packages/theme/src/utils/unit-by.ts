/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export function unitBy(input: string, factor: number): string {
  const v = Number.parseFloat(input)
  const units = /(px|em|rem|%)$/.exec(input)?.[1] || ''
  return `${v * factor}${units}`
}
