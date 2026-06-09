import { useCallback, useMemo, useReducer } from 'react'
import type { Tool } from '../domain/tool.entity'
import type { ToolsTabKey } from '../domain/tools-tab.model'
import type { ProgressEntry } from '../application/tools-state.model'
import { toolsReducer } from '../application/tools.reducer'
import { ToolFilterService } from '../application/tool-filter.service'
// TODO API: cargar el listado desde GET /api/tools (reemplazar MOCK_TOOLS y manejar carga async con loading/error).
import { MOCK_TOOLS } from '../infraestructure/mocks/tools.mock'

const initialState = {
  rows: MOCK_TOOLS,
  filters: { brands: [], statuses: [] },
  selectedIds: new Set<number>(),
  tab: 'all' as ToolsTabKey,
  page: 1,
  showFilters: true,
  density: 'dense' as const,
  newToolOpen: false,
  ingresoTool: null,
  progress: null,
}

export function useToolsInventory() {
  const [state, dispatch] = useReducer(toolsReducer, initialState)

  const filteredRows = useMemo(
    () => ToolFilterService.apply(state.rows, state.filters, state.tab),
    [state.rows, state.filters, state.tab],
  )

  const allSelected = useMemo(
    () => filteredRows.length > 0 && filteredRows.every((tool) => state.selectedIds.has(tool.id)),
    [filteredRows, state.selectedIds],
  )

  const someSelected = useMemo(
    () => state.selectedIds.size > 0 && !allSelected,
    [state.selectedIds, allSelected],
  )

  const toggleBrand = useCallback((brand: string) => dispatch({ type: 'TOGGLE_BRAND', brand }), [])
  const toggleStatus = useCallback((status: string) => dispatch({ type: 'TOGGLE_STATUS', status }), [])
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), [])
  const toggleSelect = useCallback((id: number) => dispatch({ type: 'TOGGLE_SELECT', id }), [])
  const toggleSelectAll = useCallback(
    () => dispatch({ type: 'TOGGLE_SELECT_ALL', filteredIds: filteredRows.map((tool) => tool.id) }),
    [filteredRows],
  )
  const setTab = useCallback((tab: ToolsTabKey) => dispatch({ type: 'SET_TAB', tab }), [])
  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const toggleFiltersPanel = useCallback(() => dispatch({ type: 'TOGGLE_FILTERS_PANEL' }), [])
  const setDensity = useCallback(
    (density: 'dense' | 'comfy') => dispatch({ type: 'SET_DENSITY', density }),
    [],
  )
  const openNewTool = useCallback(() => dispatch({ type: 'OPEN_NEW_TOOL' }), [])
  const closeNewTool = useCallback(() => dispatch({ type: 'CLOSE_NEW_TOOL' }), [])
  const openIngreso = useCallback((tool: Tool) => dispatch({ type: 'OPEN_INGRESO', tool }), [])
  const closeIngreso = useCallback(() => dispatch({ type: 'CLOSE_INGRESO' }), [])
  const confirmIngreso = useCallback(
    (tool: Tool, total: number) => dispatch({ type: 'CONFIRM_INGRESO', tool, total }),
    [],
  )
  const finishIngreso = useCallback(() => dispatch({ type: 'FINISH_INGRESO' }), [])

  return {
    state,
    filteredRows,
    allSelected,
    someSelected,
    toggleBrand,
    toggleStatus,
    clearFilters,
    toggleSelect,
    toggleSelectAll,
    setTab,
    setPage,
    toggleFiltersPanel,
    setDensity,
    openNewTool,
    closeNewTool,
    openIngreso,
    closeIngreso,
    confirmIngreso,
    finishIngreso,
    progress: state.progress as ProgressEntry | null,
  }
}
