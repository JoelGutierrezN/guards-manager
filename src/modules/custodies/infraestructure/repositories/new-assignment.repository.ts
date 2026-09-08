import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { EmployeeOption } from '../../domain/employee-option.model'
import type {
  AssignmentProductOption,
  AvailableStocksPage,
} from '../../domain/new-assignment-option.model'
import type {
  AvailableStocksQuery,
  NewAssignmentRepository as NewAssignmentRepositoryContract,
} from '../../domain/new-assignment-repository'
import type { EmployeeOptionCollectionDto, EmployeeOptionDto } from '../dto/employee-option.dto'
import type {
  AssignmentProductCollectionDto,
  AvailableStockCollectionDto,
} from '../dto/new-assignment.dto'
import { EmployeeOptionMapper } from '../mappers/employee-option.mapper'
import { NewAssignmentMapper } from '../mappers/new-assignment.mapper'

const SEARCH_PAGE_SIZE = '10'
const ACTIVE_EMPLOYEE_STATUS = 'activo'
const AVAILABLE_STOCK_STATUS = 'available'

/** Datos que alimentan el wizard de nueva asignación: empleados activos, productos y unidades libres. */
class NewAssignmentRepositoryImpl implements NewAssignmentRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async searchActiveEmployees(query: string): Promise<EmployeeOption[]> {
    const params = new URLSearchParams({
      per_page: SEARCH_PAGE_SIZE,
      status: ACTIVE_EMPLOYEE_STATUS,
    })
    const trimmedQuery = query.trim()
    if (trimmedQuery !== '') params.set('search', trimmedQuery)

    const response = await this.datasource.get<EmployeeOptionCollectionDto>(
      `/employees?${params.toString()}`,
    )
    return EmployeeOptionMapper.toEmployeeOptions(response)
  }

  async getEmployee(employeeId: string): Promise<EmployeeOption> {
    const response = await this.datasource.get<EmployeeOptionDto>(`/employees/${employeeId}`)
    return EmployeeOptionMapper.toEmployeeOptionWithoutToolsCount(response)
  }

  async searchProducts(query: string): Promise<AssignmentProductOption[]> {
    const params = new URLSearchParams({ per_page: SEARCH_PAGE_SIZE })
    const trimmedQuery = query.trim()
    if (trimmedQuery !== '') params.set('name', trimmedQuery)

    const response = await this.datasource.get<AssignmentProductCollectionDto>(
      `/products?${params.toString()}`,
    )
    return NewAssignmentMapper.toProductOptions(response)
  }

  async listAvailableStocks({
    productId,
    consecutive,
    page,
  }: AvailableStocksQuery): Promise<AvailableStocksPage> {
    const params = new URLSearchParams({
      status: AVAILABLE_STOCK_STATUS,
      per_page: SEARCH_PAGE_SIZE,
      page: String(page),
    })
    if (productId !== null) params.set('product_id', productId)
    const trimmedConsecutive = consecutive.trim()
    if (trimmedConsecutive !== '') params.set('q', trimmedConsecutive)

    const response = await this.datasource.get<AvailableStockCollectionDto>(
      `/stocks?${params.toString()}`,
    )
    return NewAssignmentMapper.toAvailableStocksPage(response)
  }
}

export const newAssignmentRepository = new NewAssignmentRepositoryImpl()
