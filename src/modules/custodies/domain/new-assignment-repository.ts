import type { EmployeeOption } from './employee-option.model'
import type { AssignmentProductOption, AvailableStocksPage } from './new-assignment-option.model'

export interface AvailableStocksQuery {
  productId: string | null
  consecutive: string
  page: number
}

export interface NewAssignmentRepository {
  searchActiveEmployees(query: string): Promise<EmployeeOption[]>
  getEmployee(employeeId: string): Promise<EmployeeOption>
  searchProducts(query: string): Promise<AssignmentProductOption[]>
  listAvailableStocks(query: AvailableStocksQuery): Promise<AvailableStocksPage>
}
