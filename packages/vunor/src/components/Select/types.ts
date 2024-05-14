export type TSelectItems<
  T extends {
    icon?: string
    value: string | null | undefined
    label?: string
    disabled?: boolean
  } = {
    icon?: string
    value: string | null | undefined
    label?: string
    disabled?: boolean
  },
> = (T | string)[] | Record<string, (T | string)[]>
