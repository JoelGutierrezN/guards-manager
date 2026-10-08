import type { EmployeeStatus } from '../domain/employee-status.model'
import type {
  EmployeeLifecycleConfirmKind,
  EmployeeLifecycleTarget,
} from './employee-lifecycle-state.model'
import { EmployeeStatusHelper } from './employee-status.helper'

const DELETE_EYEBROW = 'Eliminar empleado'
const STATUS_EYEBROW = 'Cambiar estado'
const DELETE_BODY = 'Esta acción no se puede deshacer.'
const DEACTIVATE_BODY = 'El empleado dejará de poder recibir nuevas asignaciones.'
const REACTIVATE_BODY = 'El empleado volverá a estar disponible para nuevas asignaciones.'

export class EmployeeLifecycleTextsHelper {
  static statusActionLabel(status: EmployeeStatus): string {
    return EmployeeStatusHelper.isActive(status) ? 'Dar de baja' : 'Reactivar'
  }

  static title(target: EmployeeLifecycleTarget, kind: EmployeeLifecycleConfirmKind): string {
    if (kind === 'delete') return `¿Eliminar a ${target.name}?`
    return `¿${EmployeeLifecycleTextsHelper.statusActionLabel(target.status)} a ${target.name}?`
  }

  static eyebrow(kind: EmployeeLifecycleConfirmKind): string {
    return kind === 'delete' ? DELETE_EYEBROW : STATUS_EYEBROW
  }

  static body(target: EmployeeLifecycleTarget, kind: EmployeeLifecycleConfirmKind): string {
    if (kind === 'delete') return DELETE_BODY
    return EmployeeStatusHelper.isActive(target.status) ? DEACTIVATE_BODY : REACTIVATE_BODY
  }

  static confirmLabel(target: EmployeeLifecycleTarget, kind: EmployeeLifecycleConfirmKind): string {
    return kind === 'delete'
      ? 'Eliminar'
      : EmployeeLifecycleTextsHelper.statusActionLabel(target.status)
  }

  /** Mensaje de éxito con el estado YA aplicado que devuelve el API. */
  static statusChangedToast(status: EmployeeStatus): string {
    return EmployeeStatusHelper.isActive(status) ? 'Empleado reactivado' : 'Empleado dado de baja'
  }

  static deletedToast(name: string): string {
    return `Empleado "${name}" eliminado`
  }
}
