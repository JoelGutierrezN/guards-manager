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
    const tools =
      employee.activeToolsCount === 1
        ? '1 herramienta activa'
        : `${employee.activeToolsCount} herramientas activas`
    return `${role} · ${tools}`
  }
}
