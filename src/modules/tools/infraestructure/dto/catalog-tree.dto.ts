export interface CatalogBrandDto {
  id: string
  name: string
  totalProducts: number
  productModels: Array<{ id: string; name: string; totalProducts: number }>
}

export interface CatalogTreeDto {
  meta: { maxStock: number }
  data: CatalogBrandDto[]
}
