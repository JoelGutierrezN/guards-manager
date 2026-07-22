import type { Brand } from './brand.entity'

export interface BrandPage {
  brands: Brand[]
  page: number
  perPage: number
  lastPage: number
  total: number
  modelsTotal: number
  toolsTotal: number
}
