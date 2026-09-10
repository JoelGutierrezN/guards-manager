import type { CustodyReturnSummary } from '../domain/custody.entity'
import { initialCustodyReturnsState, type CustodyReturnsState } from './custody-returns-state.model'

export type CustodyReturnsAction =
  | { type: 'LOAD_START'; page: number }
  | {
      type: 'LOAD_SUCCESS'
      returns: CustodyReturnSummary[]
      page: number
      lastPage: number
      total: number
    }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'RESET'; returns: CustodyReturnSummary[] }

export function custodyReturnsReducer(
  state: CustodyReturnsState,
  action: CustodyReturnsAction,
): CustodyReturnsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', requestedPage: action.page, error: null }
    case 'LOAD_SUCCESS':
      return {
        status: 'ready',
        returns: action.returns,
        page: action.page,
        requestedPage: action.page,
        lastPage: action.lastPage,
        total: action.total,
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'RESET':
      return initialCustodyReturnsState(action.returns)
  }
}
