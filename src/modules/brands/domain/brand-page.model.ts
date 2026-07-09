import type { Brand } from './brand.entity'

export interface BrandPage {
  brands: Brand[]
  page: number
  lastPage: number
  total: number
  modelsTotal: number
  toolsTotal: number
}
