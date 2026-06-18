import type { ToolsState, ToolsAction } from './tools-state.model'
import { DEFAULT_STOCK_RANGE } from './tools-state.model'
import { InventoryService } from './inventory.service'

export function toolsReducer(state: ToolsState, action: ToolsAction): ToolsState {
  switch (action.type) {
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
        page: 1,
      }
    case 'SET_TAB':
      return { ...state, tab: action.tab, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'TOGGLE_FILTERS_PANEL':
      return { ...state, showFilters: !state.showFilters }
    case 'OPEN_NEW_TOOL':
      return { ...state, newToolOpen: true }
    case 'CLOSE_NEW_TOOL':
      return { ...state, newToolOpen: false }
    case 'OPEN_INGRESO':
      return { ...state, ingresoTool: action.tool }
    case 'CLOSE_INGRESO':
      return { ...state, ingresoTool: null }
    case 'CONFIRM_INGRESO':
      return { ...state, ingresoTool: null, progress: { tool: action.tool, total: action.total } }
    case 'FINISH_INGRESO': {
      if (!state.progress) return { ...state, progress: null }
      const updatedRows = InventoryService.addStock(state.rows, state.progress.tool.id, state.progress.total)
      return { ...state, rows: updatedRows, progress: null }
    }
    case 'OPEN_STOCK':
      return { ...state, stockTool: action.tool }
    case 'CLOSE_STOCK':
      return { ...state, stockTool: null }
    case 'OPEN_DELETE':
      return { ...state, deleteTool: action.tool }
    case 'CLOSE_DELETE':
      return { ...state, deleteTool: null }
    case 'CONFIRM_DELETE':
      return { ...state, rows: state.rows.filter((tool) => tool.id !== action.tool.id), deleteTool: null }
    default:
      return state
  }
}
