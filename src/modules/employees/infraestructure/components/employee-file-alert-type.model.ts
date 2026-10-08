import { Alert02Icon, UserRemove01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import type { EmployeeFileAlertType } from '../../domain/employee-file-alert.model'

export const EMPLOYEE_FILE_ALERT_ICONS: Record<EmployeeFileAlertType, IconSvgElement> = {
  inactivo_con_herramientas: UserRemove01Icon,
  daño_reciente: Alert02Icon,
}
