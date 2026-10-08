import type { IconSvgElement } from '@hugeicons/react'

export type DashboardKpiTone = 'default' | 'cream' | 'lavender'

export interface DashboardKpiCard {
  key: string
  label: string
  value: number
  caption: string
  icon: IconSvgElement
  tone: DashboardKpiTone
}
