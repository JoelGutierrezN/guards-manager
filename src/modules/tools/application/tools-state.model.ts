import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsPage } from '../domain/tools-page.model'
import type { ToolsSort, ToolsSortKey } from '../domain/tools-sort.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'

export const DEFAULT_STOCK_RANGE: [number, number] = [0, 50]

export const DEFAULT_TOOLS_SORT: ToolsSort = { key: 'name', direction: 'asc' }

export type ToolsStatus = 'loading' | 'ready' | 'error'

export interface ToolsState {
  rows: Tool[]
  status: ToolsStatus
  error: string | null
  filters: ToolFilters
  search: string
  sort: ToolsSort
  tab: ToolsTabKey
  page: number
  perPage: number
  lastPage: number
  total: number
  showFilters: boolean
  formTool: Tool | null
  isFormOpen: boolean
  stockTool: Tool | null
  deleteTool: Tool | null
  deleteConflict: string | null
  isDeleting: boolean
}

export const INITIAL_TOOLS_STATE: ToolsState = {
  rows: [],
  status: 'loading',
  error: null,
  filters: { brands: [], models: [], stockRange: DEFAULT_STOCK_RANGE },
  search: '',
  sort: DEFAULT_TOOLS_SORT,
  tab: 'all',
  page: 1,
  perPage: 25,
  lastPage: 1,
  total: 0,
  showFilters: true,
  formTool: null,
  isFormOpen: false,
  stockTool: null,
  deleteTool: null,
  deleteConflict: null,
  isDeleting: false,
}

export type ToolsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: ToolsPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'TOGGLE_BRAND'; brand: string }
  | { type: 'TOGGLE_MODEL'; model: string }
  | { type: 'SET_STOCK_RANGE'; range: [number, number] }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'TOGGLE_SORT'; key: ToolsSortKey }
  | { type: 'SET_TAB'; tab: ToolsTabKey }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'TOGGLE_FILTERS_PANEL' }
  | { type: 'OPEN_TOOL_FORM'; tool: Tool | null }
  | { type: 'CLOSE_TOOL_FORM' }
  | { type: 'OPEN_STOCK'; tool: Tool }
  | { type: 'CLOSE_STOCK' }
  | { type: 'OPEN_DELETE'; tool: Tool }
  | { type: 'CLOSE_DELETE' }
  | { type: 'DELETE_START' }
  | { type: 'DELETE_CONFLICT'; message: string }
  | { type: 'DELETE_DONE' }
