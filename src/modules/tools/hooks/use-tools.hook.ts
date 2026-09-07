import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { Tool } from '../domain/tool.entity'
import type { ToolInput } from '../domain/tool-input.model'
import type { ToolsSortKey } from '../domain/tools-sort.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'
import type { ToolMutationResult } from '../application/tool-mutation-result.model'
import { toolsReducer } from '../application/tools.reducer'
import { toolsRepository } from '../infraestructure/repositories/tools.repository'
import type { ToolsListRequest } from '../infraestructure/helpers/tools-query-params.helper'
import { ToolsQueryParamsHelper } from '../infraestructure/helpers/tools-query-params.helper'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'

const FILTERS_DEBOUNCE_MS = 250
const LIST_ERROR_MESSAGE = 'No se pudieron cargar las herramientas.'
const DELETE_FALLBACK_MESSAGE = 'No se pudo eliminar la herramienta.'

interface UseToolsOptions {
  onMutated?: () => void
}

export function useTools({ onMutated }: UseToolsOptions = {}) {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(
    toolsReducer,
    params,
    ToolsQueryParamsHelper.initialStateFrom,
  )
  const requestRef = useRef<ToolsListRequest>({
    page: state.page,
    tab: state.tab,
    search: state.search,
    sort: state.sort,
    filters: state.filters,
  })

  const listRequest = useMemo<ToolsListRequest>(
    () => ({
      page: state.page,
      tab: state.tab,
      search: state.search,
      sort: state.sort,
      filters: state.filters,
    }),
    [state.page, state.tab, state.search, state.sort, state.filters],
  )

  useEffect(() => {
    requestRef.current = listRequest
  }, [listRequest])

  useEffect(() => {
    setQueryParams(ToolsQueryParamsHelper.toParams(listRequest))
  }, [listRequest, setQueryParams])

  const load = useCallback(async (request: ToolsListRequest) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await toolsRepository.listProducts(ToolsQueryParamsHelper.toApiParams(request))
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch {
      dispatch({ type: 'LOAD_ERROR', error: LIST_ERROR_MESSAGE })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load(listRequest)
    }, FILTERS_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [listRequest, load])

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
  const setSearch = useCallback((search: string) => dispatch({ type: 'SET_SEARCH', search }), [])
  const toggleSort = useCallback((key: ToolsSortKey) => dispatch({ type: 'TOGGLE_SORT', key }), [])
  const setTab = useCallback((tab: ToolsTabKey) => dispatch({ type: 'SET_TAB', tab }), [])
  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const toggleFiltersPanel = useCallback(() => dispatch({ type: 'TOGGLE_FILTERS_PANEL' }), [])
  const openCreateTool = useCallback(() => dispatch({ type: 'OPEN_TOOL_FORM', tool: null }), [])
  const openEditTool = useCallback((tool: Tool) => dispatch({ type: 'OPEN_TOOL_FORM', tool }), [])
  const closeToolForm = useCallback(() => dispatch({ type: 'CLOSE_TOOL_FORM' }), [])
  const openStock = useCallback((tool: Tool) => dispatch({ type: 'OPEN_STOCK', tool }), [])
  const closeStock = useCallback(() => dispatch({ type: 'CLOSE_STOCK' }), [])
  const openDelete = useCallback((tool: Tool) => dispatch({ type: 'OPEN_DELETE', tool }), [])
  const closeDelete = useCallback(() => dispatch({ type: 'CLOSE_DELETE' }), [])

  const editingTool = state.formTool

  const saveTool = useCallback(
    async (input: ToolInput): Promise<Tool> => {
      const savedTool =
        editingTool === null
          ? await toolsRepository.create(input)
          : await toolsRepository.update(editingTool.id, input)
      dispatch({ type: 'CLOSE_TOOL_FORM' })
      void load(requestRef.current)
      onMutated?.()
      return savedTool
    },
    [editingTool, load, onMutated],
  )

  const confirmDelete = useCallback(async (): Promise<ToolMutationResult | null> => {
    const tool = state.deleteTool
    if (tool === null) return null
    dispatch({ type: 'DELETE_START' })
    try {
      await toolsRepository.remove(tool.id)
      dispatch({ type: 'DELETE_DONE' })
      if (state.rows.length === 1 && state.page > 1) {
        dispatch({ type: 'SET_PAGE', page: state.page - 1 })
      } else {
        void load(requestRef.current)
      }
      onMutated?.()
      return { message: `Herramienta "${tool.name}" eliminada del catálogo`, tone: 'success' }
    } catch (error) {
      const message = ApiConflictErrorHelper.isConflict(error)
        ? ApiConflictErrorHelper.messageFrom(error, DELETE_FALLBACK_MESSAGE)
        : DELETE_FALLBACK_MESSAGE
      dispatch({ type: 'DELETE_CONFLICT', message })
      return { message, tone: 'error' }
    }
  }, [state.deleteTool, state.rows.length, state.page, load, onMutated])

  return {
    state,
    editingTool,
    reloadList,
    toggleBrand,
    toggleModel,
    setStockRange,
    clearFilters,
    setSearch,
    toggleSort,
    setTab,
    setPage,
    toggleFiltersPanel,
    openCreateTool,
    openEditTool,
    closeToolForm,
    saveTool,
    openStock,
    closeStock,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}
