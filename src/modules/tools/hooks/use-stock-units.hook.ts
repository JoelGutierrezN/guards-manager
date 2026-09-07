import { useCallback, useEffect, useReducer } from 'react'
import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { ToolUnit, StockUnitStatus } from '../domain/tool-unit.model'
import { stockUnitsRepository } from '../infraestructure/repositories/stock-units.repository'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'
import { stockUnitsReducer } from '../application/stock-units.reducer'
import {
  createInitialStockUnitsState,
  STOCK_UNITS_PER_PAGE,
} from '../application/stock-units-state.model'

const SEARCH_DEBOUNCE_MS = 250
const LOAD_ERROR_MESSAGE = 'No se pudieron cargar las unidades.'
const CONDITION_ERROR_MESSAGE = 'No se pudo cambiar la condición de la unidad.'
const DELETE_ERROR_MESSAGE = 'No se pudo eliminar la unidad.'

export function useStockUnits(productId: string | null, open: boolean) {
  const [state, dispatch] = useReducer(stockUnitsReducer, undefined, createInitialStockUnitsState)

  useEffect(() => {
    if (open) dispatch({ type: 'RESET' })
  }, [open, productId])

  const activeTabState = state.tabs[state.activeTab]

  const loadTab = useCallback(
    async (tab: StockUnitStatus, page: number, query: string, silent: boolean) => {
      if (!productId) return
      dispatch({ type: 'LOAD_START', tab, silent })
      try {
        const result = await stockUnitsRepository.list({
          productId,
          status: tab,
          query,
          page,
          perPage: STOCK_UNITS_PER_PAGE,
        })
        dispatch({ type: 'LOAD_SUCCESS', tab, page: result })
      } catch {
        dispatch({ type: 'LOAD_ERROR', tab, message: LOAD_ERROR_MESSAGE })
      }
    },
    [productId],
  )

  useEffect(() => {
    if (!open || !productId) return
    const handle = setTimeout(() => {
      void loadTab(state.activeTab, activeTabState.page, state.query, false)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [open, productId, state.activeTab, activeTabState.page, state.query, loadTab])

  const setTab = useCallback((tab: StockUnitStatus) => dispatch({ type: 'SET_TAB', tab }), [])
  const setQuery = useCallback((query: string) => dispatch({ type: 'SET_QUERY', query }), [])
  const setPage = useCallback(
    (page: number) => dispatch({ type: 'SET_PAGE', tab: state.activeTab, page }),
    [state.activeTab],
  )

  const changeCondition = useCallback(
    async (unit: ToolUnit, condition: ItemCondition): Promise<void> => {
      dispatch({ type: 'ACTION_START', unitId: unit.id })
      try {
        const updated = await stockUnitsRepository.updateCondition(unit.id, condition)
        dispatch({ type: 'CONDITION_UPDATED', tab: state.activeTab, unit: updated })
      } catch (error) {
        const message = ApiConflictErrorHelper.isConflict(error)
          ? ApiConflictErrorHelper.messageFrom(error, CONDITION_ERROR_MESSAGE)
          : CONDITION_ERROR_MESSAGE
        dispatch({ type: 'ACTION_ERROR', message })
      }
    },
    [state.activeTab],
  )

  const openDelete = useCallback((unit: ToolUnit) => dispatch({ type: 'OPEN_DELETE', unit }), [])
  const closeDelete = useCallback(() => dispatch({ type: 'CLOSE_DELETE' }), [])

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    const unit = state.deletingUnit
    if (!unit) return false
    dispatch({ type: 'ACTION_START', unitId: unit.id })
    try {
      await stockUnitsRepository.remove(unit.id)
      dispatch({ type: 'UNIT_REMOVED', tab: state.activeTab, unitId: unit.id })
      const remaining = activeTabState.units.length - 1
      if (remaining === 0 && activeTabState.page > 1) {
        dispatch({ type: 'SET_PAGE', tab: state.activeTab, page: activeTabState.page - 1 })
      }
      return true
    } catch (error) {
      const message = ApiConflictErrorHelper.isConflict(error)
        ? ApiConflictErrorHelper.messageFrom(error, DELETE_ERROR_MESSAGE)
        : DELETE_ERROR_MESSAGE
      dispatch({ type: 'ACTION_ERROR', message })
      dispatch({ type: 'CLOSE_DELETE' })
      return false
    }
  }, [state.deletingUnit, state.activeTab, activeTabState.units.length, activeTabState.page])

  return {
    state,
    activeTabState,
    setTab,
    setQuery,
    setPage,
    changeCondition,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}
