import type { ToolUnit, StockUnitStatus } from '../domain/tool-unit.model'
import type { StockUnitsListPage } from '../domain/stock-units-list-page.model'

export const STOCK_UNIT_STATUSES: StockUnitStatus[] = ['available', 'assigned', 'unusable']

export const STOCK_UNITS_PER_PAGE = 10

export type StockUnitsTabStatus = 'idle' | 'loading' | 'reloading' | 'ready' | 'error'

export interface StockUnitsTabState {
  status: StockUnitsTabStatus
  units: ToolUnit[]
  page: number
  perPage: number
  lastPage: number
  total: number
  error: string | null
}

export type StockUnitsTabsMap = Record<StockUnitStatus, StockUnitsTabState>

export interface StockUnitsState {
  activeTab: StockUnitStatus
  query: string
  tabs: StockUnitsTabsMap
  pendingUnitId: string | null
  actionError: string | null
  deletingUnit: ToolUnit | null
}

function createEmptyTabState(): StockUnitsTabState {
  return {
    status: 'idle',
    units: [],
    page: 1,
    perPage: STOCK_UNITS_PER_PAGE,
    lastPage: 1,
    total: 0,
    error: null,
  }
}

export function createInitialStockUnitsState(): StockUnitsState {
  return {
    activeTab: 'available',
    query: '',
    tabs: {
      available: createEmptyTabState(),
      assigned: createEmptyTabState(),
      unusable: createEmptyTabState(),
    },
    pendingUnitId: null,
    actionError: null,
    deletingUnit: null,
  }
}

export type StockUnitsAction =
  | { type: 'RESET' }
  | { type: 'SET_TAB'; tab: StockUnitStatus }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_PAGE'; tab: StockUnitStatus; page: number }
  | { type: 'LOAD_START'; tab: StockUnitStatus; silent: boolean }
  | { type: 'LOAD_SUCCESS'; tab: StockUnitStatus; page: StockUnitsListPage }
  | { type: 'LOAD_ERROR'; tab: StockUnitStatus; message: string }
  | { type: 'ACTION_START'; unitId: string }
  | { type: 'ACTION_ERROR'; message: string }
  | { type: 'CONDITION_UPDATED'; tab: StockUnitStatus; unit: ToolUnit }
  | { type: 'OPEN_DELETE'; unit: ToolUnit }
  | { type: 'CLOSE_DELETE' }
  | { type: 'UNIT_REMOVED'; tab: StockUnitStatus; unitId: string }
