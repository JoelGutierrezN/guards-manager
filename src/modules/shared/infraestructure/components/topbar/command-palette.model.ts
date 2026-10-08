import type { IconSvgElement } from '@hugeicons/react'

export interface CommandPaletteNavItem {
  id: string
  label: string
  groupTitle: string
  icon: IconSvgElement
  path: string
}

export interface CommandPaletteSearchAction {
  id: string
  label: string
  path: string
}
