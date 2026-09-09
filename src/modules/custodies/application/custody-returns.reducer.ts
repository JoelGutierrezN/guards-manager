import type { CustodyReturnSummary } from '../domain/custody.entity'
import type { CustodyReturnsState } from './custody-returns-state.model'

export type CustodyReturnsAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS'
      returns: CustodyReturnSummary[]
      page: number
      lastPage: number
      total: number
    }
  | { type: 'LOAD_ERROR'; error: string }

export function custodyReturnsReducer(
  state: CustodyReturnsState,
  action: CustodyReturnsAction,
): CustodyReturnsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        status: 'ready',
        returns: action.returns,
        page: action.page,
        lastPage: action.lastPage,
        total: action.total,
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
  }
}
