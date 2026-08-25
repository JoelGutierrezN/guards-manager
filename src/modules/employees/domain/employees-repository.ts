import type { EmployeesListPage } from './employees-list-page.model'

export interface EmployeesRepository {
  list(params: URLSearchParams): Promise<EmployeesListPage>
}
