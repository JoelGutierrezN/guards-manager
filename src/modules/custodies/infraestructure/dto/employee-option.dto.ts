import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface EmployeeOptionDto {
  id: string
  identifier: string
  name: string
  roleName: string | null
  activeToolsCount: number
}

export interface EmployeeOptionCollectionDto {
  data: EmployeeOptionDto[]
  meta: PaginationMetaDto
}
