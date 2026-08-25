import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface EmployeeDto {
  id: string
  identifier: string
  name: string
  roleId: string
  roleName: string
  email: string | null
  phone: string | null
  activeToolsCount: number
  historicalToolsCount: number
  hireDate: string
  alertsCount: number
}

export interface EmployeeRequestDto {
  name: string
  role_id: string
  email: string | null
  phone: string | null
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
