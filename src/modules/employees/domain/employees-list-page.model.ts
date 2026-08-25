import type { Pagination } from '../../shared/domain/pagination.model'
import type { Employee } from './employee.entity'
import type { EmployeesStats } from './employees-stats.entity'

export interface EmployeesListPage extends Pagination {
  employees: Employee[]
  stats: EmployeesStats
}
