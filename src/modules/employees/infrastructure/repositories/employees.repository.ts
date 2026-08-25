import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { EmployeesRepository as EmployeesRepositoryContract } from '../../domain/employees-repository'
import type { Employee } from '../../domain/employee.entity'
import type { CreateEmployeeInput, UpdateEmployeeInput } from '../../domain/employee-input.model'
import type { EmployeesListPage } from '../../domain/employees-list-page.model'
import type { DownloadedFile } from '../../../shared/domain/downloaded-file.model'
import type { EmployeeCollectionDto, EmployeeDto } from '../dto/employee.dto'
import { EmployeeMapper } from '../mappers/employee.mapper'

const EXPORT_FALLBACK_FILENAME = 'empleados.xlsx'

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

  async export(params: URLSearchParams): Promise<DownloadedFile> {
    return this.datasource.getFile(
      `/employees/export?${params.toString()}`,
      EXPORT_FALLBACK_FILENAME,
    )
  }

  async create(input: CreateEmployeeInput): Promise<Employee> {
    const response = await this.datasource.post<EmployeeDto>(
      '/employees',
      EmployeeMapper.toRequestBody(input),
    )
    return EmployeeMapper.toEmployee(response)
  }

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const response = await this.datasource.put<EmployeeDto>(
      `/employees/${id}`,
      EmployeeMapper.toRequestBody(input),
    )
    return EmployeeMapper.toEmployee(response)
  }
}

export const employeesRepository = new EmployeesRepositoryImpl()
