import type { ProductOption } from '../domain/product-option.model'
import type { StockInResult } from '../domain/stock-in-result.model'
import {
  MIN_STOCK_IN_QUANTITY,
  type StockInAction,
  type StockInState,
} from './stock-in-state.model'

function productWithFreshCounts(
  product: ProductOption | null,
  result: StockInResult,
): ProductOption {
  return {
    id: result.product.id,
    name: result.product.name,
    brandName: product?.brandName ?? null,
    modelName: product?.modelName ?? null,
    total: result.product.total,
    available: result.product.available,
  }
}

export function stockInReducer(state: StockInState, action: StockInAction): StockInState {
  switch (action.type) {
    case 'PRODUCT_LOAD_START':
      return { ...state, isProductLoading: true, error: null }
    case 'PRODUCT_LOAD_SUCCESS':
      return { ...state, isProductLoading: false, product: action.payload, error: null }
    case 'PRODUCT_LOAD_ERROR':
      return { ...state, isProductLoading: false, product: null, error: action.payload }
    case 'PRODUCT_SELECTED':
      return { ...state, product: action.payload, error: null }
    case 'QUANTITY_CHANGED':
      return { ...state, quantity: action.payload, error: null }
    case 'CONDITION_CHANGED':
      return { ...state, condition: action.payload, error: null }
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', error: null }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        status: 'done',
        product: productWithFreshCounts(state.product, action.payload),
        result: action.payload,
        error: null,
      }
    case 'SUBMIT_ERROR':
      return { ...state, status: 'editing', error: action.payload }
    case 'ANOTHER_ENTRY_STARTED':
      return {
        ...state,
        status: 'editing',
        quantity: MIN_STOCK_IN_QUANTITY,
        result: null,
        error: null,
      }
    default:
      return state
  }
}
