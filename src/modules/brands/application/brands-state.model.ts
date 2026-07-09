import type { Brand } from '../domain/brand.entity'
import type { BrandPage } from '../domain/brand-page.model'

export type BrandsStatus = 'loading' | 'ready' | 'error'

export interface BrandsState {
  brands: Brand[]
  status: BrandsStatus
  error: string | null
  saving: boolean
  createOpen: boolean
  editBrand: Brand | null
  page: number
  lastPage: number
  total: number
  modelsTotal: number
  toolsTotal: number
  query: string
}

export type BrandsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: BrandPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'OPEN_CREATE' }
  | { type: 'CLOSE_CREATE' }
  | { type: 'OPEN_EDIT'; brand: Brand }
  | { type: 'CLOSE_EDIT' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR' }
  | { type: 'SAVE_DONE' }

export const INITIAL_BRANDS_STATE: BrandsState = {
  brands: [],
  status: 'loading',
  error: null,
  saving: false,
  createOpen: false,
  editBrand: null,
  page: 1,
  lastPage: 1,
  total: 0,
  modelsTotal: 0,
  toolsTotal: 0,
  query: '',
}
