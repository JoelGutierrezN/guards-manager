import type { Employee } from './employee.entity'
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employee-input.model'
import type { EmployeesListPage } from './employees-list-page.model'

export interface EmployeesRepository {
  list(params: URLSearchParams): Promise<EmployeesListPage>
  create(input: CreateEmployeeInput): Promise<Employee>
  update(id: string, input: UpdateEmployeeInput): Promise<Employee>
}
