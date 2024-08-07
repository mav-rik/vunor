export interface TVunorShortcut {
  [name: string]: string | TVunorShortcut | undefined | string[]
}

export const defineShortcuts = (sc: TVunorShortcut): TVunorShortcut => sc
