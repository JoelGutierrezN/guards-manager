import type { ProductModelStatusDto } from './product-model.dto'

export interface NameCheckModelDto {
  id: string
  name: string
  brandId: string
  status: ProductModelStatusDto
  discontinuationReason: string | null
  brand: {
    id: string
    name: string
  }
}

export interface ProductModelNameCheckDto {
  exists: boolean
  productModel: NameCheckModelDto | null
  similar: NameCheckModelDto[]
}
