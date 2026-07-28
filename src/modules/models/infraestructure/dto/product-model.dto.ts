export type ProductModelStatusDto = 'activo' | 'baja'

export interface ProductModelBrandDto {
  id: string
  name: string
}

export interface ProductModelDto {
  id: string
  name: string
  brandId: string
  brand: ProductModelBrandDto
  status?: ProductModelStatusDto | null
  discontinuationReason?: string | null
  stocksTotal?: number
  stocksAssigned?: number
  usagePercentage?: number
}
