import type { UsersAction, UsersState } from './users-state.model'

export function usersReducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        rows: action.result.users,
        page: action.result.page,
        perPage: action.result.perPage,
        lastPage: action.result.lastPage,
        total: action.result.total,
        status: 'ready',
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'SET_QUERY':
      return { ...state, query: action.query, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'SAVE_START':
      return { ...state, saving: true, formError: null, formErrors: {} }
    case 'SAVE_ERROR':
      return { ...state, saving: false, formError: action.message, formErrors: action.errors }
    case 'SAVE_DONE':
      return { ...state, saving: false, formError: null, formErrors: {} }
    case 'ROW_ADDED': {
      const total = state.total + 1
      return {
        ...state,
        rows: [action.user, ...state.rows].slice(0, state.perPage),
        total,
        lastPage: Math.max(1, Math.ceil(total / state.perPage)),
      }
    }
    case 'ROW_UPDATED':
      return {
        ...state,
        rows: state.rows.map((row) => (row.id === action.user.id ? action.user : row)),
      }
    default:
      return state
  }
}
