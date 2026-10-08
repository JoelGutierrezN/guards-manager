import type { DownloadedFile } from '../../shared/domain/downloaded-file.model'
import type { Employee } from './employee.entity'
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employee-input.model'
import type { EmployeesListPage } from './employees-list-page.model'
import type { EmployeeStatus } from './employee-status.model'

export interface EmployeesRepository {
  list(params: URLSearchParams): Promise<EmployeesListPage>
  export(params: URLSearchParams): Promise<DownloadedFile>
  create(input: CreateEmployeeInput): Promise<Employee>
  update(id: string, input: UpdateEmployeeInput): Promise<Employee>
  updateStatus(id: string, status: EmployeeStatus): Promise<Employee>
  remove(id: string): Promise<void>
}
