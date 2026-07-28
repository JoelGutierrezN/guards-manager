import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'
import type { ProductModelDto } from './product-model.dto'

export interface ProductModelCollectionMetaDto extends PaginationMetaDto {
  productModels: number
  brands: number
  stocks: number
}

export interface ProductModelCollectionDto {
  data: ProductModelDto[]
  meta: ProductModelCollectionMetaDto
}
