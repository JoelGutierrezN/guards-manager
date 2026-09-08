import type { CustodiesFilters } from '../domain/custodies-filters.model'
import type { CustodyStatus } from '../domain/custody-status.model'

export class CustodiesFiltersHelper {
  static activeCount(filters: CustodiesFilters): number {
    return (
      (filters.statuses.length > 0 ? 1 : 0) +
      (filters.employeeId !== '' ? 1 : 0) +
      (filters.dateFrom !== '' || filters.dateTo !== '' ? 1 : 0)
    )
  }

  static hasActive(filters: CustodiesFilters): boolean {
    return CustodiesFiltersHelper.activeCount(filters) > 0
  }

  static toggleStatus(statuses: CustodyStatus[], status: CustodyStatus): CustodyStatus[] {
    if (statuses.includes(status)) return statuses.filter((current) => current !== status)
    return [...statuses, status]
  }
}
