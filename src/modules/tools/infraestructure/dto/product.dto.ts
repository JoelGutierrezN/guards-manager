import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface ProductDto {
  id: string
  name: string
  brand?: string | null
  brandId?: string | null
  model?: string | null
  productModelId?: string | null
  total?: number
  available?: number
  assigned?: number
  unusable?: number
  warns?: number
}

export interface ProductCollectionDto {
  data: ProductDto[]
  meta: PaginationMetaDto
}
