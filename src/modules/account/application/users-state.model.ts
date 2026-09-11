import type { User } from '../domain/user.entity'
import type { UsersListPage } from '../domain/users-list-page.model'

export type UsersStatus = 'loading' | 'ready' | 'error'

export interface UsersState {
  rows: User[]
  status: UsersStatus
  error: string | null
  query: string
  page: number
  perPage: number
  lastPage: number
  total: number
  saving: boolean
  formError: string | null
}

export const INITIAL_USERS_STATE: UsersState = {
  rows: [],
  status: 'loading',
  error: null,
  query: '',
  page: 1,
  perPage: 10,
  lastPage: 1,
  total: 0,
  saving: false,
  formError: null,
}

export type UsersAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: UsersListPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; message: string }
  | { type: 'SAVE_DONE' }
  | { type: 'ROW_ADDED'; user: User }
  | { type: 'ROW_UPDATED'; user: User }
