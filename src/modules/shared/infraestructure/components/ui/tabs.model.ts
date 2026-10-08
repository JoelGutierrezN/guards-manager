import type { IconSvgElement } from '@hugeicons/react'

export interface TabItem<T extends string = string> {
  value: T
  label: string
  count?: number
  badge?: string
  icon?: IconSvgElement
}
