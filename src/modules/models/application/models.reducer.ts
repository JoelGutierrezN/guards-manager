import type { ModelsState, ModelsAction } from './models-state.model'

export function modelsReducer(state: ModelsState, action: ModelsAction): ModelsState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        status: state.status === 'ready' || state.status === 'reloading' ? 'reloading' : 'loading',
        error: null,
      }
    case 'LOAD_SUCCESS': {
      const { models, perPage, lastPage, total, modelsTotal, brandsTotal, stocksTotal } =
        action.result
      return {
        ...state,
        status: 'ready',
        models,
        perPage: Math.max(state.perPage, perPage, models.length),
        lastPage,
        total,
        modelsTotal,
        brandsTotal,
        stocksTotal,
      }
    }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'SET_QUERY':
      return { ...state, query: action.query, page: 1 }
    case 'SET_BRAND':
      return { ...state, brandId: action.brandId, page: 1 }
    case 'SAVE_START':
      return { ...state, saving: true, formError: null }
    case 'SAVE_ERROR':
      return { ...state, saving: false, formError: action.message }
    case 'SAVE_DONE':
      return { ...state, saving: false, formError: null }
    case 'ROW_START':
      return { ...state, pendingId: action.id }
    case 'ROW_UPDATED': {
      const { model } = action
      return {
        ...state,
        models: state.models.map((row) =>
          row.id === model.id
            ? {
                ...row,
                name: model.name,
                active: model.active,
                discontinuationReason: model.discontinuationReason,
              }
            : row,
        ),
      }
    }
    case 'ROW_REMOVED': {
      const models = state.models.filter((row) => row.id !== action.id)
      const total = Math.max(0, state.total - 1)
      return {
        ...state,
        models,
        total,
        modelsTotal: Math.max(0, state.modelsTotal - 1),
        lastPage: Math.max(1, Math.ceil(total / state.perPage)),
      }
    }
    case 'ROW_DONE':
      return { ...state, pendingId: null }
    default:
      return state
  }
}
