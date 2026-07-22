import type { BrandsState, BrandsAction } from './brands-state.model'

export function brandsReducer(state: BrandsState, action: BrandsAction): BrandsState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        status: state.status === 'ready' || state.status === 'reloading' ? 'reloading' : 'loading',
        error: null,
      }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        status: 'ready',
        brands: action.result.brands,
        perPage: Math.max(state.perPage, action.result.perPage, action.result.brands.length),
        lastPage: action.result.lastPage,
        total: action.result.total,
        modelsTotal: action.result.modelsTotal,
        toolsTotal: action.result.toolsTotal,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'SET_QUERY':
      return { ...state, query: action.query, page: 1 }
    case 'SAVE_START':
      return { ...state, saving: true }
    case 'SAVE_ERROR':
      return { ...state, saving: false }
    case 'SAVE_DONE':
      return { ...state, saving: false }
    default:
      return state
  }
}
