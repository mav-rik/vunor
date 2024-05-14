export type TSelectItems<
  T extends {
    icon?: string
    search?: string
    value: string | null | undefined
    label?: string
    disabled?: boolean
  } = {
    icon?: string
    search?: string
    value: string | null | undefined
    label?: string
    disabled?: boolean
  },
> = (T | string)[] | Record<string, (T | string)[]>
