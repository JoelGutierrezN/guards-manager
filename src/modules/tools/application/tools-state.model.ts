import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'

export interface ProgressEntry {
  tool: Tool
  total: number
}

export const DEFAULT_STOCK_RANGE: [number, number] = [0, 50]

export interface ToolsState {
  rows: Tool[]
  filters: ToolFilters
  searchQuery: string
  tab: ToolsTabKey
  page: number
  showFilters: boolean
  newToolOpen: boolean
  ingresoTool: Tool | null
  progress: ProgressEntry | null
}

export type ToolsAction =
  | { type: 'TOGGLE_BRAND'; brand: string }
  | { type: 'TOGGLE_MODEL'; model: string }
  | { type: 'SET_STOCK_RANGE'; range: [number, number] }
  | { type: 'SET_SEARCH'; query: string }
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
