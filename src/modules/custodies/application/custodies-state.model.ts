import type { Custody } from '../domain/custody.entity'
import type { CustodiesListPage } from '../domain/custodies-list-page.model'
import type { CustodiesStats } from '../domain/custodies-stats.entity'
import { INITIAL_CUSTODIES_FILTERS, type CustodiesFilters } from '../domain/custodies-filters.model'

export type CustodiesStatus = 'loading' | 'ready' | 'error'

export interface CustodiesState {
  rows: Custody[]
  status: CustodiesStatus
  error: string | null
  query: string
  filters: CustodiesFilters
  page: number
  perPage: number
  lastPage: number
  total: number
  stats: CustodiesStats | null
}

export const INITIAL_CUSTODIES_STATE: CustodiesState = {
  rows: [],
  status: 'loading',
  error: null,
  query: '',
  filters: INITIAL_CUSTODIES_FILTERS,
  page: 1,
  perPage: 10,
  lastPage: 1,
  total: 0,
  stats: null,
}

export type CustodiesAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: CustodiesListPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_FILTERS'; filters: Partial<CustodiesFilters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_PAGE'; page: number }
