import type { NewModelFormAction, NewModelFormState } from './new-model-form.model'

export function newModelFormReducer(
  state: NewModelFormState,
  action: NewModelFormAction,
): NewModelFormState {
  switch (action.type) {
    case 'SET_BRAND_SEARCH':
      return { ...state, brandSearch: action.search }
    case 'SELECT_BRAND':
      return {
        ...state,
        step: 'name',
        brandId: action.brandId,
        brandName: action.brandName,
        brandDetail: null,
        checkStatus: 'idle',
        duplicateModel: null,
        similarModels: [],
        similarConfirmed: false,
      }
    case 'BACK_TO_BRAND':
      return {
        ...state,
        step: 'brand',
        checkStatus: 'idle',
        duplicateModel: null,
        similarModels: [],
        similarConfirmed: false,
      }
    case 'BRAND_DETAIL_START':
      return { ...state, brandDetailLoading: true }
    case 'BRAND_DETAIL_SUCCESS':
      return { ...state, brandDetailLoading: false, brandDetail: action.brand }
    case 'BRAND_DETAIL_ERROR':
      return { ...state, brandDetailLoading: false, brandDetail: null }
    case 'SET_NAME':
      return {
        ...state,
        name: action.name,
        checkStatus: 'idle',
        duplicateModel: null,
        similarModels: [],
        similarConfirmed: false,
      }
    case 'CHECK_START':
      return { ...state, checkStatus: 'checking' }
    case 'CHECK_RESULT':
      return {
        ...state,
        checkStatus: action.status,
        duplicateModel: action.duplicateModel,
        similarModels: action.similarModels,
      }
    case 'SET_SIMILAR_CONFIRMED':
      return { ...state, similarConfirmed: action.confirmed }
    default:
      return state
  }
}
