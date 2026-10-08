import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'
import type { BrandDto } from './brand.dto'

export interface BrandCollectionMetaDto extends PaginationMetaDto {
  productModels?: number
  products?: number
}

export interface BrandCollectionDto {
  data: BrandDto[]
  meta: BrandCollectionMetaDto
}
