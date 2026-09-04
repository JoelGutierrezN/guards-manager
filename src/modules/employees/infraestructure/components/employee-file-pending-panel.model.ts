import { Alert02Icon, File01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type EmployeeFilePendingTab = 'docs' | 'damage'

export interface EmployeeFilePendingContent {
  icon: IconSvgElement
  title: string
  body: string
}

export const EMPLOYEE_FILE_PENDING_CONTENT: Record<
  EmployeeFilePendingTab,
  EmployeeFilePendingContent
> = {
  // TODO API: documentos firmados pendientes de implementación en backend
  docs: {
    icon: File01Icon,
    title: 'Documentos en camino',
    body: 'Las hojas de resguardo y devolución firmadas aparecerán aquí cuando el módulo de documentos esté listo.',
  },
  // TODO API: reportes de daño pendientes de implementación en backend
  damage: {
    icon: Alert02Icon,
    title: 'Sin reportes de daño',
    body: 'El registro de daños todavía no está disponible. Aparecerá aquí en cuanto se habilite.',
  },
}
