export interface NameCheckModelDto {
  id: string
  name: string
  brandId: string
  status: 'active' | 'discontinued'
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
