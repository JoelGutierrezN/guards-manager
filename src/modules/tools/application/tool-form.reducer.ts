import type { ToolFormAction, ToolFormState } from './tool-form.model'

export function toolFormReducer(state: ToolFormState, action: ToolFormAction): ToolFormState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name, apiErrors: { ...state.apiErrors, name: undefined } }
    case 'SET_BRAND':
      return {
        ...state,
        brandId: action.brandId,
        brandName: action.brandName,
        productModelId: '',
        productModelName: '',
        apiErrors: { ...state.apiErrors, brandId: undefined, productModelId: undefined },
      }
    case 'SET_PRODUCT_MODEL':
      return {
        ...state,
        productModelId: action.productModelId,
        productModelName: action.productModelName,
        apiErrors: { ...state.apiErrors, productModelId: undefined },
      }
    case 'PREFILL_START':
      return { ...state, prefillStatus: 'loading' }
    case 'PREFILL_SUCCESS':
      return {
        ...state,
        prefillStatus: 'ready',
        brandId: action.prefill.brandId,
        brandName: action.prefill.brandName,
        productModelId: action.prefill.productModelId,
        productModelName: action.prefill.productModelName,
      }
    case 'PREFILL_ERROR':
      return { ...state, prefillStatus: 'error' }
    case 'TOUCH':
      return { ...state, touched: true }
    case 'SAVE_START':
      return { ...state, isSaving: true, apiErrors: {}, apiMessage: null }
    case 'SAVE_ERROR':
      return { ...state, isSaving: false, apiErrors: action.errors, apiMessage: action.message }
    case 'SAVE_DONE':
      return { ...state, isSaving: false, apiErrors: {}, apiMessage: null }
    default:
      return state
  }
}
