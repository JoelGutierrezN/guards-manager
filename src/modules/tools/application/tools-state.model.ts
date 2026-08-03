import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsPage } from '../domain/tools-page.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'

export interface ProgressEntry {
  tool: Tool
  total: number
}

export const DEFAULT_STOCK_RANGE: [number, number] = [0, 50]

export type ToolsStatus = 'loading' | 'ready' | 'error'

export interface ToolsState {
  rows: Tool[]
  status: ToolsStatus
  error: string | null
  filters: ToolFilters
  tab: ToolsTabKey
  page: number
  perPage: number
  lastPage: number
  total: number
  showFilters: boolean
  newToolOpen: boolean
  ingresoTool: Tool | null
  stockTool: Tool | null
  deleteTool: Tool | null
  progress: ProgressEntry | null
}

export const INITIAL_TOOLS_STATE: ToolsState = {
  rows: [],
  status: 'loading',
  error: null,
  filters: { brands: [], models: [], stockRange: DEFAULT_STOCK_RANGE },
  tab: 'all',
  page: 1,
  perPage: 25,
  lastPage: 1,
  total: 0,
  showFilters: true,
  newToolOpen: false,
  ingresoTool: null,
  stockTool: null,
  deleteTool: null,
  progress: null,
}

export type ToolsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: ToolsPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'TOGGLE_BRAND'; brand: string }
  | { type: 'TOGGLE_MODEL'; model: string }
  | { type: 'SET_STOCK_RANGE'; range: [number, number] }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_TAB'; tab: ToolsTabKey }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'TOGGLE_FILTERS_PANEL' }
  | { type: 'OPEN_NEW_TOOL' }
  | { type: 'CLOSE_NEW_TOOL' }
  | { type: 'OPEN_INGRESO'; tool: Tool }
  | { type: 'CLOSE_INGRESO' }
  | { type: 'CONFIRM_INGRESO'; tool: Tool; total: number }
  | { type: 'FINISH_INGRESO' }
  | { type: 'OPEN_STOCK'; tool: Tool }
  | { type: 'CLOSE_STOCK' }
  | { type: 'OPEN_DELETE'; tool: Tool }
  | { type: 'CLOSE_DELETE' }
  | { type: 'CONFIRM_DELETE'; tool: Tool }
