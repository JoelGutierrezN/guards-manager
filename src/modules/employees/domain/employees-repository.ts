import type { DownloadedFile } from '../../shared/domain/downloaded-file.model'
import type { Employee } from './employee.entity'
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employee-input.model'
import type { EmployeesListPage } from './employees-list-page.model'

export interface EmployeesRepository {
  list(params: URLSearchParams): Promise<EmployeesListPage>
  export(params: URLSearchParams): Promise<DownloadedFile>
  create(input: CreateEmployeeInput): Promise<Employee>
  update(id: string, input: UpdateEmployeeInput): Promise<Employee>
}
