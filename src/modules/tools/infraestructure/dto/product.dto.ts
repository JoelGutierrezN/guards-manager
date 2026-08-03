import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface ProductDto {
  id: string
  name: string
  brand: string | null
  model: string | null
  total: number
  available: number
  warns: number
}

export interface ProductCollectionDto {
  data: ProductDto[]
  meta: PaginationMetaDto
}
