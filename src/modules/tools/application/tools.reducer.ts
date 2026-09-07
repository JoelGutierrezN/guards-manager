import type { ToolsState, ToolsAction } from './tools-state.model'
import { DEFAULT_STOCK_RANGE } from './tools-state.model'

export function toolsReducer(state: ToolsState, action: ToolsAction): ToolsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        rows: action.result.tools,
        page: action.result.page,
        perPage: action.result.perPage,
        lastPage: action.result.lastPage,
        total: action.result.total,
        status: 'ready',
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'TOGGLE_BRAND': {
      const hasBrand = state.filters.brands.includes(action.brand)
      const updatedBrands = hasBrand
        ? state.filters.brands.filter((brand) => brand !== action.brand)
        : [...state.filters.brands, action.brand]
      return { ...state, filters: { ...state.filters, brands: updatedBrands }, page: 1 }
    }
    case 'TOGGLE_MODEL': {
      const hasModel = state.filters.models.includes(action.model)
      const updatedModels = hasModel
        ? state.filters.models.filter((model) => model !== action.model)
        : [...state.filters.models, action.model]
      return { ...state, filters: { ...state.filters, models: updatedModels }, page: 1 }
    }
    case 'SET_STOCK_RANGE':
      return { ...state, filters: { ...state.filters, stockRange: action.range }, page: 1 }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: { brands: [], models: [], stockRange: DEFAULT_STOCK_RANGE },
        search: '',
        page: 1,
      }
    case 'SET_SEARCH':
      return { ...state, search: action.search, page: 1 }
    case 'TOGGLE_SORT': {
      const isSameKey = state.sort.key === action.key
      const direction = isSameKey && state.sort.direction === 'asc' ? 'desc' : 'asc'
      return { ...state, sort: { key: action.key, direction }, page: 1 }
    }
    case 'SET_TAB':
      return { ...state, tab: action.tab, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'TOGGLE_FILTERS_PANEL':
      return { ...state, showFilters: !state.showFilters }
    case 'OPEN_TOOL_FORM':
      return { ...state, isFormOpen: true, formTool: action.tool }
    case 'CLOSE_TOOL_FORM':
      return { ...state, isFormOpen: false, formTool: null }
    case 'OPEN_STOCK':
      return { ...state, stockTool: action.tool }
    case 'CLOSE_STOCK':
      return { ...state, stockTool: null }
    case 'OPEN_DELETE':
      return { ...state, deleteTool: action.tool, deleteConflict: null, isDeleting: false }
    case 'CLOSE_DELETE':
      return { ...state, deleteTool: null, deleteConflict: null, isDeleting: false }
    case 'DELETE_START':
      return { ...state, isDeleting: true, deleteConflict: null }
    case 'DELETE_CONFLICT':
      return { ...state, isDeleting: false, deleteConflict: action.message }
    case 'DELETE_DONE':
      return { ...state, isDeleting: false, deleteTool: null, deleteConflict: null }
    default:
      return state
  }
}
