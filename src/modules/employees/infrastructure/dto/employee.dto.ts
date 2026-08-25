import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface EmployeeDto {
  id: string
  identifier: string
  name: string
  areaName: string
  roleName: string
  activeToolsCount: number
  historicalToolsCount: number
  hireDate: string
  alertsCount: number
}

export interface EmployeesStatsDto {
  totalEmployees: number
  withActiveTools: number
  withAlerts: number
}

export interface EmployeeCollectionDto {
  data: EmployeeDto[]
  meta: PaginationMetaDto
  stats: EmployeesStatsDto
}
