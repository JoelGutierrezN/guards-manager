import type { Pagination } from '../../shared/domain/pagination.model'
import type { ProductModel } from './product-model.entity'

export interface ProductModelPage extends Pagination {
  models: ProductModel[]
  modelsTotal: number
  brandsTotal: number
  stocksTotal: number
}
