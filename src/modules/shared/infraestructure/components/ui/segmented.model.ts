import type { IconSvgElement } from '@hugeicons/react'

export interface SegmentedItem<T extends string = string> {
  value: T
  label: string
  icon?: IconSvgElement
}
