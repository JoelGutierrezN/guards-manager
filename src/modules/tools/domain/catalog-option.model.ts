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
  id: string
  name: string
  count: number
}

export interface CatalogBrandNode {
  id: string
  brand: string
  count: number
  models: CatalogModelNode[]
}

export interface CatalogTree {
  maxStock: number
  brands: CatalogBrandNode[]
}
