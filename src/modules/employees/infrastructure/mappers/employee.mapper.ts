import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { Employee } from '../../domain/employee.entity'
import type { EmployeesStats } from '../../domain/employees-stats.entity'
import type { EmployeesListPage } from '../../domain/employees-list-page.model'
import type { CreateEmployeeInput } from '../../domain/employee-input.model'
import type {
  EmployeeCollectionDto,
  EmployeeDto,
  EmployeeRequestDto,
  EmployeesStatsDto,
} from '../dto/employee.dto'

export class EmployeeMapper {
  static toRequestBody(input: CreateEmployeeInput): EmployeeRequestDto {
    return {
      name: input.name,
      role_id: input.roleId,
      email: input.email,
      phone: input.phone,
    }
  }

  static toEmployee(dto: EmployeeDto): Employee {
    return {
      id: dto.id,
      identifier: dto.identifier,
      name: dto.name,
      roleId: dto.roleId,
      roleName: dto.roleName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      activeToolsCount: dto.activeToolsCount,
      historicalToolsCount: dto.historicalToolsCount,
      hireDate: dto.hireDate,
      alertsCount: dto.alertsCount,
    }
  }

  static toStats(dto: EmployeesStatsDto): EmployeesStats {
    return {
      totalEmployees: dto.totalEmployees,
      withActiveTools: dto.withActiveTools,
      withAlerts: dto.withAlerts,
    }
  }

  static toEmployeesListPage(dto: EmployeeCollectionDto): EmployeesListPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      employees: dto.data.map((employee) => EmployeeMapper.toEmployee(employee)),
      stats: EmployeeMapper.toStats(dto.stats),
    }
  }
}
