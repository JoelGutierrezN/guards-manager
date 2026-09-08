import type { CustodyStatus } from './custody-status.model'

export interface CustodiesFilters {
  statuses: CustodyStatus[]
  employeeId: string
  employeeName: string
  dateFrom: string
  dateTo: string
}

export const INITIAL_CUSTODIES_FILTERS: CustodiesFilters = {
  statuses: [],
  employeeId: '',
  employeeName: '',
  dateFrom: '',
  dateTo: '',
}
