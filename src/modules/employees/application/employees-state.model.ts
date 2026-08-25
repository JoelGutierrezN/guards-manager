import type { Employee } from '../domain/employee.entity'
import type { EmployeesStats } from '../domain/employees-stats.entity'
import type { EmployeesListPage } from '../domain/employees-list-page.model'
import { INITIAL_EMPLOYEES_FILTERS, type EmployeesFilters } from '../domain/employees-filters.model'

export type EmployeesStatus = 'loading' | 'ready' | 'error'

export interface EmployeesState {
  rows: Employee[]
  status: EmployeesStatus
  error: string | null
  query: string
  filters: EmployeesFilters
  page: number
  perPage: number
  lastPage: number
  total: number
  stats: EmployeesStats | null
  saving: boolean
  formError: string | null
}

export const INITIAL_EMPLOYEES_STATE: EmployeesState = {
  rows: [],
  status: 'loading',
  error: null,
  query: '',
  filters: INITIAL_EMPLOYEES_FILTERS,
  page: 1,
  perPage: 10,
  lastPage: 1,
  total: 0,
  stats: null,
  saving: false,
  formError: null,
}

export type EmployeesAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: EmployeesListPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_FILTERS'; filters: Partial<EmployeesFilters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; message: string }
  | { type: 'SAVE_DONE' }
  | { type: 'ROW_ADDED'; employee: Employee }
  | { type: 'ROW_UPDATED'; employee: Employee }
