import type { Brand } from '../domain/brand.entity'
import type { BrandPage } from '../domain/brand-page.model'


export type BrandsStatus = 'loading' | 'reloading' | 'ready' | 'error'

export interface BrandsState {
  brands: Brand[]
  status: BrandsStatus
  error: string | null
  saving: boolean
  page: number
  perPage: number
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
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR' }
  | { type: 'SAVE_DONE' }

const DEFAULT_PAGE_SIZE = 11

export const INITIAL_BRANDS_STATE: BrandsState = {
  brands: [],
  status: 'loading',
  error: null,
  saving: false,
  page: 1,
  perPage: DEFAULT_PAGE_SIZE,
  lastPage: 1,
  total: 0,
  modelsTotal: 0,
  toolsTotal: 0,
  query: '',
}
