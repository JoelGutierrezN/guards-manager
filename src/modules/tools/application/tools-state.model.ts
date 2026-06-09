import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'

export interface ProgressEntry {
  tool: Tool
  total: number
}

export interface ToolsState {
  rows: Tool[]
  filters: ToolFilters
  selectedIds: Set<number>
  tab: ToolsTabKey
  page: number
  showFilters: boolean
  density: 'dense' | 'comfy'
  newToolOpen: boolean
  ingresoTool: Tool | null
  progress: ProgressEntry | null
}

export type ToolsAction =
  | { type: 'TOGGLE_BRAND'; brand: string }
  | { type: 'TOGGLE_STATUS'; status: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_SELECT'; id: number }
  | { type: 'TOGGLE_SELECT_ALL'; filteredIds: number[] }
  | { type: 'SET_TAB'; tab: ToolsTabKey }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'TOGGLE_FILTERS_PANEL' }
  | { type: 'SET_DENSITY'; density: 'dense' | 'comfy' }
  | { type: 'OPEN_NEW_TOOL' }
  | { type: 'CLOSE_NEW_TOOL' }
  | { type: 'OPEN_INGRESO'; tool: Tool }
  | { type: 'CLOSE_INGRESO' }
  | { type: 'CONFIRM_INGRESO'; tool: Tool; total: number }
  | { type: 'FINISH_INGRESO' }
