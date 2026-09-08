import type { EmployeeOption } from './employee-option.model'

export interface EmployeesSearchRepository {
  search(query: string): Promise<EmployeeOption[]>
}
