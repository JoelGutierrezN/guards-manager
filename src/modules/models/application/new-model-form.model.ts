import type { Brand } from '../../brands/domain/brand.entity'
import type { NameCheckMatch } from '../domain/product-model-name-check.model'

export type NewModelStep = 'brand' | 'name'

export type NameCheckStatus = 'idle' | 'checking' | 'free' | 'duplicate' | 'similar' | 'error'

export interface NewModelFormState {
  step: NewModelStep
  brandSearch: string
  brandId: string
  brandName: string
  brandDetail: Brand | null
  brandDetailLoading: boolean
  name: string
  checkStatus: NameCheckStatus
  duplicateModel: NameCheckMatch | null
  similarModels: NameCheckMatch[]
  similarConfirmed: boolean
}

export type NewModelFormAction =
  | { type: 'SET_BRAND_SEARCH'; search: string }
  | { type: 'SELECT_BRAND'; brandId: string; brandName: string }
  | { type: 'BACK_TO_BRAND' }
  | { type: 'BRAND_DETAIL_START' }
  | { type: 'BRAND_DETAIL_SUCCESS'; brand: Brand }
  | { type: 'BRAND_DETAIL_ERROR' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'CHECK_START' }
  | {
      type: 'CHECK_RESULT'
      status: NameCheckStatus
      duplicateModel: NameCheckMatch | null
      similarModels: NameCheckMatch[]
    }
  | { type: 'SET_SIMILAR_CONFIRMED'; confirmed: boolean }
