import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { CustodyDetail } from '../domain/custody.entity'
import type { ReturnErrorReport } from '../domain/return-error.model'
import type { CustodyReturn } from '../domain/return.entity'

export type ReturnStatus = 'loading' | 'editing' | 'submitting' | 'done' | 'error'

export interface ReturnItemDraft {
  condition: ItemCondition
  notes: string
}

export interface ReturnState {
  custody: CustodyDetail | null
  status: ReturnStatus
  loadError: string | null
  selectedStockIds: string[]
  drafts: Record<string, ReturnItemDraft>
  notes: string
  error: ReturnErrorReport | null
  createdReturn: CustodyReturn | null
}

export const INITIAL_RETURN_STATE: ReturnState = {
  custody: null,
  status: 'loading',
  loadError: null,
  selectedStockIds: [],
  drafts: {},
  notes: '',
  error: null,
  createdReturn: null,
}

export type ReturnAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS'
      payload: {
        custody: CustodyDetail
        drafts: Record<string, ReturnItemDraft>
        selectedStockIds: string[]
      }
    }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SELECTION_CHANGED'; payload: string[] }
  | { type: 'ITEM_CONDITION_CHANGED'; payload: { stockId: string; condition: ItemCondition } }
  | { type: 'ITEM_NOTES_CHANGED'; payload: { stockId: string; notes: string } }
  | { type: 'NOTES_CHANGED'; payload: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: CustodyReturn }
  | { type: 'SUBMIT_ERROR'; payload: ReturnErrorReport }
