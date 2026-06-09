import type { ToolsState, ToolsAction } from './tools-state.model'
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
    case 'TOGGLE_STATUS': {
      const hasStatus = state.filters.statuses.includes(action.status)
      const updatedStatuses = hasStatus
        ? state.filters.statuses.filter((status) => status !== action.status)
        : [...state.filters.statuses, action.status]
      return { ...state, filters: { ...state.filters, statuses: updatedStatuses }, page: 1 }
    }
    case 'CLEAR_FILTERS':
      return { ...state, filters: { brands: [], statuses: [] }, page: 1 }
    case 'TOGGLE_SELECT': {
      const nextSelected = new Set(state.selectedIds)
      if (nextSelected.has(action.id)) {
        nextSelected.delete(action.id)
      } else {
        nextSelected.add(action.id)
      }
      return { ...state, selectedIds: nextSelected }
    }
    case 'TOGGLE_SELECT_ALL': {
      const allCurrentlySelected = action.filteredIds.every((id) => state.selectedIds.has(id))
      const nextSelected = allCurrentlySelected ? new Set<number>() : new Set(action.filteredIds)
      return { ...state, selectedIds: nextSelected }
    }
    case 'SET_TAB':
      return { ...state, tab: action.tab, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'TOGGLE_FILTERS_PANEL':
      return { ...state, showFilters: !state.showFilters }
    case 'SET_DENSITY':
      return { ...state, density: action.density }
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
    default:
      return state
  }
}
