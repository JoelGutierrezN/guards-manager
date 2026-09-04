import { Alert02Icon, Clock01Icon, File01Icon, Wrench01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type EmployeeFileTab = 'active' | 'history' | 'docs' | 'damage'

export interface EmployeeFileTabDescriptor {
  value: EmployeeFileTab
  label: string
  icon: IconSvgElement
  pending: boolean
}

export const EMPLOYEE_FILE_PENDING_BADGE = 'dev'

export const DEFAULT_EMPLOYEE_FILE_TAB: EmployeeFileTab = 'active'

export const EMPLOYEE_FILE_TABS: EmployeeFileTabDescriptor[] = [
  { value: 'active', label: 'Activas', icon: Wrench01Icon, pending: false },
  { value: 'history', label: 'Historial', icon: Clock01Icon, pending: false },
  // Pendiente Fase 4: los documentos del expediente llegan con las hojas firmadas
  { value: 'docs', label: 'Documentos', icon: File01Icon, pending: true },
  // Pendiente Fase 5: los daños llegan con el expediente completo
  { value: 'damage', label: 'Daños', icon: Alert02Icon, pending: true },
]
