import type { Brand } from '../domain/brand.entity'
import type { BrandPage } from '../domain/brand-page.model'
import type { BrandDeletionPreview } from '../domain/brand-deletion-preview.model'

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
  deletionPreview: BrandDeletionPreview | null
  deletionPreviewStatus: 'idle' | 'loading' | 'ready' | 'error'
  deleting: boolean
  deleteError: string | null
  merging: boolean
  mergeError: string | null
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
  | { type: 'DELETION_PREVIEW_START' }
  | { type: 'DELETION_PREVIEW_SUCCESS'; preview: BrandDeletionPreview }
  | { type: 'DELETION_PREVIEW_ERROR' }
  | { type: 'DELETE_START' }
  | { type: 'DELETE_ERROR'; message: string }
  | { type: 'DELETE_DONE' }
  | { type: 'MERGE_RESET' }
  | { type: 'MERGE_START' }
  | { type: 'MERGE_ERROR'; message: string }
  | { type: 'MERGE_DONE' }

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
  deletionPreview: null,
  deletionPreviewStatus: 'idle',
  deleting: false,
  deleteError: null,
  merging: false,
  mergeError: null,
}
