import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { ComboboxItem } from '../../shared/infraestructure/components/ui'
import {
  INITIAL_NEW_ASSIGNMENT_UNITS_STATE,
  type NewAssignmentUnitsState,
} from '../application/new-assignment-units-state.model'
import { newAssignmentUnitsReducer } from '../application/new-assignment-units.reducer'
import type { AssignmentProductOption, AvailableStock } from '../domain/new-assignment-option.model'
import { NewAssignmentErrorHelper } from '../infraestructure/helpers/new-assignment-error.helper'
import { NewAssignmentOptionHelper } from '../infraestructure/helpers/new-assignment-option.helper'
import { newAssignmentRepository } from '../infraestructure/repositories/new-assignment.repository'

const SEARCH_DEBOUNCE_MS = 300

interface NewAssignmentUnitsResult {
  state: NewAssignmentUnitsState
  selectedStocks: AvailableStock[]
  loadProductOptions: (query: string) => Promise<ComboboxItem[]>
  selectProduct: (item: ComboboxItem | null) => void
  setConsecutive: (consecutive: string) => void
  setPage: (page: number) => void
  setSelectedIds: (selectedIds: string[]) => void
  clearSelection: () => void
  retry: () => void
}

export function useNewAssignmentUnits(): NewAssignmentUnitsResult {
  const [state, dispatch] = useReducer(
    newAssignmentUnitsReducer,
    INITIAL_NEW_ASSIGNMENT_UNITS_STATE,
  )
  const [retryToken, setRetryToken] = useState(0)
  const productsCache = useRef(new Map<string, AssignmentProductOption>())

  const productId = state.product?.id ?? null
  const { consecutive, page } = state

  useEffect(() => {
    let isActive = true
    dispatch({ type: 'LOAD_START' })

    const timer = setTimeout(() => {
      newAssignmentRepository
        .listAvailableStocks({ productId, consecutive, page })
        .then((result) => {
          if (isActive) dispatch({ type: 'LOAD_SUCCESS', payload: result })
        })
        .catch((error: unknown) => {
          if (isActive) {
            dispatch({
              type: 'LOAD_ERROR',
              payload: NewAssignmentErrorHelper.unitsMessageFrom(error),
            })
          }
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [productId, consecutive, page, retryToken])

  const loadProductOptions = useCallback(async (query: string): Promise<ComboboxItem[]> => {
    const options = await newAssignmentRepository.searchProducts(query)
    options.forEach((option) => productsCache.current.set(option.id, option))
    return options.map((option) => NewAssignmentOptionHelper.toProductComboboxItem(option))
  }, [])

  const selectProduct = useCallback((item: ComboboxItem | null) => {
    const option = item === null ? null : (productsCache.current.get(item.value) ?? null)
    dispatch({ type: 'PRODUCT_SELECTED', payload: option })
  }, [])

  const setConsecutive = useCallback((value: string) => {
    dispatch({ type: 'CONSECUTIVE_CHANGED', payload: value })
  }, [])

  const setPage = useCallback((value: number) => {
    dispatch({ type: 'PAGE_CHANGED', payload: value })
  }, [])

  const setSelectedIds = useCallback((selectedIds: string[]) => {
    dispatch({ type: 'SELECTION_CHANGED', payload: selectedIds })
  }, [])

  const clearSelection = useCallback(() => dispatch({ type: 'SELECTION_CLEARED' }), [])

  const retry = useCallback(() => setRetryToken((token) => token + 1), [])

  const selectedStocks = useMemo(
    () => state.stocks.filter((stock) => state.selectedIds.includes(stock.id)),
    [state.stocks, state.selectedIds],
  )

  return {
    state,
    selectedStocks,
    loadProductOptions,
    selectProduct,
    setConsecutive,
    setPage,
    setSelectedIds,
    clearSelection,
    retry,
  }
}
