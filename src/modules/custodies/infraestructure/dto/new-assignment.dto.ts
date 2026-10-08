import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'
import type { ItemCondition } from '../../../shared/domain/item-condition.model'

export interface AssignmentProductDto {
  id: string
  name: string
  brand?: string | null
  model?: string | null
  available?: number
}

export interface AssignmentProductCollectionDto {
  data: AssignmentProductDto[]
}

export interface AvailableStockDto {
  id: string
  consecutive: string
  condition: ItemCondition
  product?: AssignmentProductDto | null
}

export interface AvailableStockCollectionDto {
  data: AvailableStockDto[]
  meta: PaginationMetaDto
}
