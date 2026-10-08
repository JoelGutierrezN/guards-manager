import type { AccountProfile } from '../domain/account-profile.model'

export type AccountMeStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface AccountMeState {
  profile: AccountProfile | null
  status: AccountMeStatus
}

export type AccountMeAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; profile: AccountProfile }
  | { type: 'FETCH_ERROR' }
  | { type: 'SET_PROFILE'; profile: AccountProfile }
