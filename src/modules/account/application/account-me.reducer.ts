import type { AccountMeAction, AccountMeState } from './account-me.model'

export function accountMeReducer(state: AccountMeState, action: AccountMeAction): AccountMeState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading' }
    case 'FETCH_SUCCESS':
      return { profile: action.profile, status: 'ready' }
    case 'FETCH_ERROR':
      return { ...state, status: 'error' }
    case 'SET_PROFILE':
      return { profile: action.profile, status: 'ready' }
    default:
      return state
  }
}
