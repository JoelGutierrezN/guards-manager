import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { Tool } from '../domain/tool.entity'
import type { ToolsTabKey } from '../domain/tools-tab.model'
import type { ProgressEntry } from '../application/tools-state.model'
import { toolsReducer } from '../application/tools.reducer'
import { toolsRepository } from '../infraestructure/repositories/tools.repository'
import type { ToolsListRequest } from '../infraestructure/helpers/tools-query-params.helper'
import { ToolsQueryParamsHelper } from '../infraestructure/helpers/tools-query-params.helper'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'

const FILTERS_DEBOUNCE_MS = 250

export function useTools() {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(
    toolsReducer,
    params,
    ToolsQueryParamsHelper.initialStateFrom,
  )
  const requestRef = useRef<ToolsListRequest>({
    page: state.page,
    tab: state.tab,
    filters: state.filters,
  })

  useEffect(() => {
    requestRef.current = { page: state.page, tab: state.tab, filters: state.filters }
  }, [state.page, state.tab, state.filters])

  useEffect(() => {
    setQueryParams(
      ToolsQueryParamsHelper.toParams({
        page: state.page,
        tab: state.tab,
        filters: state.filters,
      }),
    )
  }, [state.page, state.tab, state.filters, setQueryParams])

  const load = useCallback(async (request: ToolsListRequest) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await toolsRepository.listProducts(ToolsQueryParamsHelper.toApiParams(request))
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch {
      dispatch({ type: 'LOAD_ERROR', error: 'No se pudieron cargar las herramientas.' })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load({ page: state.page, tab: state.tab, filters: state.filters })
    }, FILTERS_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [state.page, state.tab, state.filters, load])

  const reloadList = useCallback(() => {
    void load(requestRef.current)
  }, [load])

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
    reloadList,
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
