import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { ComboboxItem } from '../../shared/infraestructure/components/ui'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import type { ProductOption } from '../domain/product-option.model'
import type { StockInResult } from '../domain/stock-in-result.model'
import { INITIAL_STOCK_IN_STATE } from '../application/stock-in-state.model'
import { stockInReducer } from '../application/stock-in.reducer'
import { ProductOptionHelper } from '../infraestructure/helpers/product-option.helper'
import { StockInErrorHelper } from '../infraestructure/helpers/stock-in-error.helper'
import { StockInNavigationHelper } from '../infraestructure/helpers/stock-in-navigation.helper'
import { inventoryRepository } from '../infraestructure/repositories/inventory.repository'

export function useStockIn() {
  const { params } = useQueryParams()
  const initialProductId = StockInNavigationHelper.productIdFrom(params)
  const [state, dispatch] = useReducer(stockInReducer, INITIAL_STOCK_IN_STATE)
  const [productRetryToken, setProductRetryToken] = useState(0)
  const optionsCache = useRef(new Map<string, ProductOption>())

  useEffect(() => {
    if (initialProductId === null) return

    let isActive = true
    dispatch({ type: 'PRODUCT_LOAD_START' })
    inventoryRepository
      .getProduct(initialProductId)
      .then((product) => {
        if (isActive) dispatch({ type: 'PRODUCT_LOAD_SUCCESS', payload: product })
      })
      .catch((error: unknown) => {
        if (isActive) {
          dispatch({
            type: 'PRODUCT_LOAD_ERROR',
            payload: StockInErrorHelper.loadProductReport(error),
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [initialProductId, productRetryToken])

  const loadProductOptions = useCallback(async (query: string): Promise<ComboboxItem[]> => {
    const options = await inventoryRepository.searchProducts(query)
    options.forEach((option) => optionsCache.current.set(option.id, option))
    return options.map((option) => ProductOptionHelper.toComboboxItem(option))
  }, [])

  const selectProduct = useCallback((item: ComboboxItem | null) => {
    const option = item === null ? null : (optionsCache.current.get(item.value) ?? null)
    dispatch({ type: 'PRODUCT_SELECTED', payload: option })
  }, [])

  const setQuantity = useCallback((quantity: number) => {
    dispatch({ type: 'QUANTITY_CHANGED', payload: quantity })
  }, [])

  const setCondition = useCallback((condition: ItemCondition) => {
    dispatch({ type: 'CONDITION_CHANGED', payload: condition })
  }, [])

  const retryProduct = useCallback(() => setProductRetryToken((token) => token + 1), [])

  const startAnotherEntry = useCallback(() => dispatch({ type: 'ANOTHER_ENTRY_STARTED' }), [])

  const { product, quantity, condition, status } = state

  const submit = useCallback(async (): Promise<StockInResult | null> => {
    if (product === null || status === 'submitting') return null

    dispatch({ type: 'SUBMIT_START' })
    try {
      const result = await inventoryRepository.createStocks({
        productId: product.id,
        quantity,
        condition,
      })
      dispatch({ type: 'SUBMIT_SUCCESS', payload: result })
      return result
    } catch (error: unknown) {
      dispatch({ type: 'SUBMIT_ERROR', payload: StockInErrorHelper.reportFrom(error) })
      return null
    }
  }, [product, quantity, condition, status])

  const canSubmit = useMemo(
    () => product !== null && status === 'editing' && !state.isProductLoading,
    [product, status, state.isProductLoading],
  )

  return {
    state,
    canSubmit,
    loadProductOptions,
    selectProduct,
    setQuantity,
    setCondition,
    retryProduct,
    startAnotherEntry,
    submit,
  }
}
