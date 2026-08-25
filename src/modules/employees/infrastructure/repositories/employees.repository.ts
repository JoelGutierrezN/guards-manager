import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { EmployeesRepository as EmployeesRepositoryContract } from '../../domain/employees-repository'
import type { EmployeesListPage } from '../../domain/employees-list-page.model'
import type { EmployeeCollectionDto } from '../dto/employee.dto'
import { EmployeeMapper } from '../mappers/employee.mapper'

class EmployeesRepositoryImpl implements EmployeesRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(params: URLSearchParams): Promise<EmployeesListPage> {
    const response = await this.datasource.get<EmployeeCollectionDto>(
      `/employees?${params.toString()}`,
    )
    return EmployeeMapper.toEmployeesListPage(response)
  }
}

export const employeesRepository = new EmployeesRepositoryImpl()
