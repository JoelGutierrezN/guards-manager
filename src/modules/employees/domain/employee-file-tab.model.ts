import { Alert02Icon, Clock01Icon, File01Icon, Wrench01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type EmployeeFileTab = 'active' | 'history' | 'docs' | 'damage'

export interface EmployeeFileTabDescriptor {
  value: EmployeeFileTab
  label: string
  icon: IconSvgElement
}

export const DEFAULT_EMPLOYEE_FILE_TAB: EmployeeFileTab = 'active'

export const EMPLOYEE_FILE_TABS: EmployeeFileTabDescriptor[] = [
  { value: 'active', label: 'Activas', icon: Wrench01Icon },
  { value: 'history', label: 'Historial', icon: Clock01Icon },
  { value: 'docs', label: 'Documentos', icon: File01Icon },
  { value: 'damage', label: 'Daños', icon: Alert02Icon },
]
