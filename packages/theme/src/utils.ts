export function round(v: number, decimals = 0) {
  const d = 10 ** decimals
  return Math.round(v * d) / d
}
