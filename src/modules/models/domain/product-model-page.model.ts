import type { ProductModel } from './product-model.entity'

export interface ProductModelPage {
  models: ProductModel[]
  page: number
  perPage: number
  lastPage: number
  total: number
  modelsTotal: number
  brandsTotal: number
  stocksTotal: number
}
