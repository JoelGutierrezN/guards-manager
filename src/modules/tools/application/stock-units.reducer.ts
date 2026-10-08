import type { StockUnitsState, StockUnitsAction } from './stock-units-state.model'
import { createInitialStockUnitsState } from './stock-units-state.model'

export function stockUnitsReducer(
  state: StockUnitsState,
  action: StockUnitsAction,
): StockUnitsState {
  switch (action.type) {
    case 'RESET':
      return createInitialStockUnitsState()
    case 'SET_TAB':
      return { ...state, activeTab: action.tab, actionError: null }
    case 'SET_QUERY': {
      const tabs = { ...state.tabs }
      for (const key of Object.keys(tabs) as (keyof typeof tabs)[]) {
        tabs[key] = { ...tabs[key], page: 1 }
      }
      return { ...state, query: action.query, tabs }
    }
    case 'SET_PAGE':
      return {
        ...state,
        tabs: { ...state.tabs, [action.tab]: { ...state.tabs[action.tab], page: action.page } },
      }
    case 'LOAD_START':
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tab]: {
            ...state.tabs[action.tab],
            status: action.silent ? 'reloading' : 'loading',
            error: null,
          },
        },
      }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tab]: {
            status: 'ready',
            units: action.page.units,
            page: action.page.page,
            perPage: action.page.perPage,
            lastPage: action.page.lastPage,
            total: action.page.total,
            error: null,
          },
        },
      }
    case 'LOAD_ERROR':
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tab]: { ...state.tabs[action.tab], status: 'error', error: action.message },
        },
      }
    case 'ACTION_START':
      return { ...state, pendingUnitId: action.unitId, actionError: null }
    case 'ACTION_ERROR':
      return { ...state, pendingUnitId: null, actionError: action.message }
    case 'CONDITION_UPDATED': {
      const tab = state.tabs[action.tab]
      const staysInTab = action.unit.status === action.tab
      const updatedUnits = staysInTab
        ? tab.units.map((unit) => (unit.id === action.unit.id ? action.unit : unit))
        : tab.units.filter((unit) => unit.id !== action.unit.id)
      const updatedTotal = staysInTab ? tab.total : Math.max(0, tab.total - 1)
      return {
        ...state,
        tabs: { ...state.tabs, [action.tab]: { ...tab, units: updatedUnits, total: updatedTotal } },
        pendingUnitId: null,
        actionError: null,
      }
    }
    case 'OPEN_DELETE':
      return { ...state, deletingUnit: action.unit }
    case 'CLOSE_DELETE':
      return { ...state, deletingUnit: null }
    case 'UNIT_REMOVED': {
      const tab = state.tabs[action.tab]
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tab]: {
            ...tab,
            units: tab.units.filter((unit) => unit.id !== action.unitId),
            total: Math.max(0, tab.total - 1),
          },
        },
        pendingUnitId: null,
        deletingUnit: null,
        actionError: null,
      }
    }
    default:
      return state
  }
}
