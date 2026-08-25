import type { EmployeesFilters } from '../domain/employees-filters.model'

export class EmployeesFiltersHelper {
  static activeCount(filters: EmployeesFilters): number {
    return (
      (filters.status !== 'todos' ? 1 : 0) +
      (filters.roleIds.length > 0 ? 1 : 0) +
      (filters.withTools ? 1 : 0) +
      (filters.hiredFrom !== '' || filters.hiredTo !== '' ? 1 : 0)
    )
  }

  static hasActive(filters: EmployeesFilters): boolean {
    return EmployeesFiltersHelper.activeCount(filters) > 0
  }

  static toggleRole(roleIds: string[], roleId: string, checked: boolean): string[] {
    if (checked) return roleIds.includes(roleId) ? roleIds : [...roleIds, roleId]
    return roleIds.filter((currentId) => currentId !== roleId)
  }
}
