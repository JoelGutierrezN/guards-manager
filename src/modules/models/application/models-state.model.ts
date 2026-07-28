import type { ProductModel } from '../domain/product-model.entity'
import type { ProductModelPage } from '../domain/product-model-page.model'
import type { ModelsFilters } from '../domain/models-filters.model'
import { INITIAL_MODELS_FILTERS } from '../domain/models-filters.model'

export type ModelsStatus = 'loading' | 'reloading' | 'ready' | 'error'

export interface ModelsState {
  models: ProductModel[]
  status: ModelsStatus
  error: string | null
  saving: boolean
  formError: string | null
  pendingId: string | null
  page: number
  perPage: number
  lastPage: number
  total: number
  modelsTotal: number
  brandsTotal: number
  stocksTotal: number
  query: string
  brandId: string | null
  filters: ModelsFilters
}

export type ModelsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: ProductModelPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_BRAND'; brandId: string | null }
  | { type: 'SET_FILTERS'; filters: Partial<ModelsFilters> }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; message: string }
  | { type: 'SAVE_DONE' }
  | { type: 'ROW_START'; id: string }
  | { type: 'ROW_UPDATED'; model: ProductModel }
  | { type: 'ROW_REMOVED'; id: string }
  | { type: 'ROW_DONE' }

const DEFAULT_PAGE_SIZE = 10

export const INITIAL_MODELS_STATE: ModelsState = {
  models: [],
  status: 'loading',
  error: null,
  saving: false,
  formError: null,
  pendingId: null,
  page: 1,
  perPage: DEFAULT_PAGE_SIZE,
  lastPage: 1,
  total: 0,
  modelsTotal: 0,
  brandsTotal: 0,
  stocksTotal: 0,
  query: '',
  brandId: null,
  filters: INITIAL_MODELS_FILTERS,
}
