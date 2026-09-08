import type { ComboboxItem } from '../../../shared/infraestructure/components/ui'
import type { EmployeeOption } from '../../domain/employee-option.model'

export class EmployeeOptionHelper {
  static toComboboxItem(employee: EmployeeOption): ComboboxItem {
    return {
      value: employee.id,
      label: `${employee.name} · ${employee.identifier}`,
      description: EmployeeOptionHelper.descriptionOf(employee),
    }
  }

  static descriptionOf(employee: EmployeeOption): string {
    const role = employee.roleName ?? 'Sin puesto'
    const { activeToolsCount } = employee
    if (activeToolsCount === null) return role
    const tools =
      activeToolsCount === 1 ? '1 herramienta activa' : `${activeToolsCount} herramientas activas`
    return `${role} · ${tools}`
  }
}
