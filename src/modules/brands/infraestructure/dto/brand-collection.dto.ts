import type { BrandDto } from './brand.dto'

export interface BrandCollectionMetaDto {
  current_page: number
  last_page: number
  per_page: number
  total: number
  productModels?: number
  products?: number
}

export interface BrandCollectionDto {
  data: BrandDto[]
  meta: BrandCollectionMetaDto
}

export interface BrandResourceDto {
  data: BrandDto
}
