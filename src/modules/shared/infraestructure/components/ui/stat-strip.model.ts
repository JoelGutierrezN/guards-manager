import type { IconSvgElement } from '@hugeicons/react'

export interface StatStripEntry {
  icon?: IconSvgElement
  label: string
  value: string
  delta?: string
  tone?: 'accent' | 'lavender' | 'cream' | 'dark'
  deltaTone?: 'up' | 'down'
}
