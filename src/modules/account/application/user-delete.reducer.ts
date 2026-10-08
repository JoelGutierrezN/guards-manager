import {
  INITIAL_USER_DELETE_STATE,
  type UserDeleteAction,
  type UserDeleteState,
} from './user-delete-state.model'

export function userDeleteReducer(
  state: UserDeleteState,
  action: UserDeleteAction,
): UserDeleteState {
  switch (action.type) {
    case 'OPEN_CONFIRM':
      return { target: action.target, loading: false, errorMessage: null }
    case 'CLOSE_CONFIRM':
      return INITIAL_USER_DELETE_STATE
    case 'ACTION_START':
      return { ...state, loading: true, errorMessage: null }
    case 'ACTION_SUCCESS':
      return INITIAL_USER_DELETE_STATE
    case 'ACTION_ERROR':
      return { ...state, loading: false, errorMessage: action.message }
    default:
      return state
  }
}
