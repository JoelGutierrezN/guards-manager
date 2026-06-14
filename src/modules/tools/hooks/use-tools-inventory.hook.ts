import { useCallback, useMemo, useReducer } from 'react'
import type { Tool } from '../domain/tool.entity'
import type { ToolsTabKey } from '../domain/tools-tab.model'
import type { ProgressEntry, ToolsState } from '../application/tools-state.model'
import { DEFAULT_STOCK_RANGE } from '../application/tools-state.model'
import { toolsReducer } from '../application/tools.reducer'
import { ToolFilterService } from '../application/tool-filter.service'
// TODO API: cargar el listado desde GET /api/tools (reemplazar MOCK_TOOLS y manejar carga async con loading/error).
import { MOCK_TOOLS } from '../infraestructure/mocks/tools.mock'

const initialState: ToolsState = {
  rows: MOCK_TOOLS,
  filters: { brands: [], models: [], stockRange: DEFAULT_STOCK_RANGE },
  tab: 'all',
  page: 1,
  showFilters: true,
  newToolOpen: false,
  ingresoTool: null,
  stockTool: null,
  deleteTool: null,
  progress: null,
}

export function useToolsInventory() {
  const [state, dispatch] = useReducer(toolsReducer, initialState)

  const filteredRows = useMemo(
    () => ToolFilterService.apply(state.rows, state.filters, state.tab),
    [state.rows, state.filters, state.tab],
  )

  const toggleBrand = useCallback((brand: string) => dispatch({ type: 'TOGGLE_BRAND', brand }), [])
  const toggleModel = useCallback((model: string) => dispatch({ type: 'TOGGLE_MODEL', model }), [])
  const setStockRange = useCallback(
    (range: [number, number]) => dispatch({ type: 'SET_STOCK_RANGE', range }),
    [],
  )
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), [])
  const setTab = useCallback((tab: ToolsTabKey) => dispatch({ type: 'SET_TAB', tab }), [])
  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const toggleFiltersPanel = useCallback(() => dispatch({ type: 'TOGGLE_FILTERS_PANEL' }), [])
  const openNewTool = useCallback(() => dispatch({ type: 'OPEN_NEW_TOOL' }), [])
  const closeNewTool = useCallback(() => dispatch({ type: 'CLOSE_NEW_TOOL' }), [])
  const openIngreso = useCallback((tool: Tool) => dispatch({ type: 'OPEN_INGRESO', tool }), [])
  const closeIngreso = useCallback(() => dispatch({ type: 'CLOSE_INGRESO' }), [])
  const confirmIngreso = useCallback(
    (tool: Tool, total: number) => dispatch({ type: 'CONFIRM_INGRESO', tool, total }),
    [],
  )
  const finishIngreso = useCallback(() => dispatch({ type: 'FINISH_INGRESO' }), [])
  const openStock = useCallback((tool: Tool) => dispatch({ type: 'OPEN_STOCK', tool }), [])
  const closeStock = useCallback(() => dispatch({ type: 'CLOSE_STOCK' }), [])
  const openDelete = useCallback((tool: Tool) => dispatch({ type: 'OPEN_DELETE', tool }), [])
  const closeDelete = useCallback(() => dispatch({ type: 'CLOSE_DELETE' }), [])
  const confirmDelete = useCallback((tool: Tool) => dispatch({ type: 'CONFIRM_DELETE', tool }), [])

  return {
    state,
    filteredRows,
    toggleBrand,
    toggleModel,
    setStockRange,
    clearFilters,
    setTab,
    setPage,
    toggleFiltersPanel,
    openNewTool,
    closeNewTool,
    openIngreso,
    closeIngreso,
    confirmIngreso,
    finishIngreso,
    openStock,
    closeStock,
    openDelete,
    closeDelete,
    confirmDelete,
    progress: state.progress as ProgressEntry | null,
  }
}
