import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { Employee } from '../../domain/employee.entity'
import type { EmployeesStats } from '../../domain/employees-stats.entity'
import type { EmployeesListPage } from '../../domain/employees-list-page.model'
import type { EmployeeCollectionDto, EmployeeDto, EmployeesStatsDto } from '../dto/employee.dto'

export class EmployeeMapper {
  static toEmployee(dto: EmployeeDto): Employee {
    return {
      id: dto.id,
      identifier: dto.identifier,
      name: dto.name,
      areaName: dto.areaName,
      roleName: dto.roleName,
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
