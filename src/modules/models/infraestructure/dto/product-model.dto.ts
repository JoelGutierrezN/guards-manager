export interface ProductModelBrandDto {
  id: string
  name: string
}

export interface ProductModelDto {
  id: string
  name: string
  brandId: string
  brand: ProductModelBrandDto
  stocksTotal?: number
  stocksAssigned?: number
  usagePercentage?: number
  active?: boolean
}
