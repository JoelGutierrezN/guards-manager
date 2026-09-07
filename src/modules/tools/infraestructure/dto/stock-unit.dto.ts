import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'
import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import type { StockUnitStatus } from '../../domain/tool-unit.model'

export interface StockUnitCustodyDto {
  id: string
  code: string
  employeeId: string
  employeeName: string
  employeeIdentifier: string
  assignedAt: string
}

export interface StockUnitDto {
  id: string
  consecutive: string
  condition: ItemCondition
  status: StockUnitStatus
  custody: StockUnitCustodyDto | null
  createdAt: string
}

export interface StockUnitCollectionDto {
  data: StockUnitDto[]
  meta: PaginationMetaDto
}
