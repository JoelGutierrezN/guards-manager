import type { CustodyReturnSummary } from '../domain/custody.entity'

export type CustodyReturnsStatus = 'ready' | 'loading' | 'error'

export interface CustodyReturnsState {
  status: CustodyReturnsStatus
  returns: CustodyReturnSummary[]
  page: number
  lastPage: number
  total: number
  error: string | null
}

export function initialCustodyReturnsState(returns: CustodyReturnSummary[]): CustodyReturnsState {
  return {
    status: 'ready',
    returns,
    page: 1,
    lastPage: 1,
    total: returns.length,
    error: null,
  }
}
