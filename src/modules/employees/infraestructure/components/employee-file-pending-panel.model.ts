import { Alert02Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type EmployeeFilePendingTab = 'damage'

export interface EmployeeFilePendingContent {
  icon: IconSvgElement
  title: string
  body: string
}

export const EMPLOYEE_FILE_PENDING_CONTENT: Record<
  EmployeeFilePendingTab,
  EmployeeFilePendingContent
> = {
  // Pendiente Fase 5: los reportes de daño llegan con el expediente completo
  damage: {
    icon: Alert02Icon,
    title: 'Sin reportes de daño',
    body: 'El registro de daños todavía no está disponible. Aparecerá aquí en cuanto se habilite.',
  },
}
