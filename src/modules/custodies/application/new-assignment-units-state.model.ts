import type {
  AssignmentProductOption,
  AvailableStock,
  AvailableStocksPage,
} from '../domain/new-assignment-option.model'

export type NewAssignmentUnitsStatus = 'loading' | 'ready' | 'error'

export interface NewAssignmentUnitsState {
  product: AssignmentProductOption | null
  consecutive: string
  page: number
  status: NewAssignmentUnitsStatus
  stocks: AvailableStock[]
  lastPage: number
  total: number
  errorMessage: string | null
  selectedIds: string[]
}

export type NewAssignmentUnitsAction =
  | { type: 'PRODUCT_SELECTED'; payload: AssignmentProductOption | null }
  | { type: 'CONSECUTIVE_CHANGED'; payload: string }
  | { type: 'PAGE_CHANGED'; payload: number }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: AvailableStocksPage }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SELECTION_CHANGED'; payload: string[] }
  | { type: 'SELECTION_CLEARED' }
  | { type: 'RESET' }

export const INITIAL_NEW_ASSIGNMENT_UNITS_STATE: NewAssignmentUnitsState = {
  product: null,
  consecutive: '',
  page: 1,
  status: 'loading',
  stocks: [],
  lastPage: 1,
  total: 0,
  errorMessage: null,
  selectedIds: [],
}
