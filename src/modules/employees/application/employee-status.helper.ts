import type { EmployeeStatus } from '../domain/employee-status.model'

export class EmployeeStatusHelper {
  static opposite(status: EmployeeStatus): EmployeeStatus {
    return status === 'activo' ? 'inactivo' : 'activo'
  }

  static isActive(status: EmployeeStatus): boolean {
    return status === 'activo'
  }

  static label(status: EmployeeStatus): string {
    return status === 'activo' ? 'Activo' : 'Inactivo'
  }
}
