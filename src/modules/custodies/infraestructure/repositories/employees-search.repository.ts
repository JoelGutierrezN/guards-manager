import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { EmployeesSearchRepository as EmployeesSearchRepositoryContract } from '../../domain/employees-search-repository'
import type { EmployeeOption } from '../../domain/employee-option.model'
import type { EmployeeOptionCollectionDto } from '../dto/employee-option.dto'
import { EmployeeOptionMapper } from '../mappers/employee-option.mapper'

const SEARCH_PAGE_SIZE = '10'

class EmployeesSearchRepositoryImpl implements EmployeesSearchRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async search(query: string): Promise<EmployeeOption[]> {
    const params = new URLSearchParams({ per_page: SEARCH_PAGE_SIZE })
    const trimmedQuery = query.trim()
    if (trimmedQuery !== '') params.set('search', trimmedQuery)

    const response = await this.datasource.get<EmployeeOptionCollectionDto>(
      `/employees?${params.toString()}`,
    )
    return EmployeeOptionMapper.toEmployeeOptions(response)
  }
}

export const employeesSearchRepository = new EmployeesSearchRepositoryImpl()
