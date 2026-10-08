export interface InventoryProductDto {
  id: string
  name: string
  brand?: string | null
  model?: string | null
  total?: number
  available?: number
}

export interface InventoryProductCollectionDto {
  data: InventoryProductDto[]
}
