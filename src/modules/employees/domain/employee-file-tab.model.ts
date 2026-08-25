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
  // TODO API: documentos pendientes de implementación en backend
  { value: 'docs', label: 'Documentos', icon: File01Icon, pending: true },
  // TODO API: daños pendientes de implementación en backend
  { value: 'damage', label: 'Daños', icon: Alert02Icon, pending: true },
]
