import type { Pagination } from '../../shared/domain/pagination.model'
import type { Brand } from './brand.entity'

export interface BrandPage extends Pagination {
  brands: Brand[]
  modelsTotal: number
  toolsTotal: number
}
