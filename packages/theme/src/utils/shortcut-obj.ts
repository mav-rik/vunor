/* eslint-disable sonarjs/no-nested-template-literals */
export function scFromObject(obj: TShortcutObject): string {
  let s = ''
  for (const [key, val] of Object.entries(obj)) {
    const a = prepareScArray(val as TShortcutObject)
    s += `${a.map(v => `${key}${v}`).join(' ')} `
  }
  return s.trim()
}

function prepareScArray(input: string | string[] | TShortcutObject): string[] {
  if (typeof input === 'string') {
    return input.split(' ')
  }
  if (Array.isArray(input)) {
    return input
  }
  const a = []
  for (const [key, val] of Object.entries(input)) {
    a.push(...prepareScArray(val as TShortcutObject).map(v => `${key}${v}`))
  }
  return a
}

type TScString = string | string[]

export type TShortcutObject = Record<
  string,
  | Record<string, Record<string, TScString | undefined> | TScString | undefined>
  | TScString
  | undefined
>
