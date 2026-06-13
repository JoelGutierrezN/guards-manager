export interface BrandOption {
  value: string
  label: string
  models: number
}

export interface ModelOption {
  value: string
  label: string
}

export interface CatalogModelNode {
  name: string
  count: number
}

export interface CatalogBrandNode {
  brand: string
  count: number
  models: CatalogModelNode[]
}
