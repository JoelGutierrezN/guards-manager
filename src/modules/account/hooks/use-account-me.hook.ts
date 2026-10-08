import { useCallback, useEffect, useReducer } from 'react'
import type { AccountProfile } from '../domain/account-profile.model'
import type { AccountMeStatus } from '../application/account-me.model'
import { accountMeReducer } from '../application/account-me.reducer'
import { accountRepository } from '../infraestructure/repositories/account.repository'

export interface UseAccountMeResult {
  profile: AccountProfile | null
  status: AccountMeStatus
  reload: () => void
  setProfile: (profile: AccountProfile) => void
}

export function useAccountMe(): UseAccountMeResult {
  const [state, dispatch] = useReducer(accountMeReducer, { profile: null, status: 'loading' })

  const reload = useCallback(() => {
    dispatch({ type: 'FETCH_START' })
    accountRepository
      .getMe()
      .then((profile) => dispatch({ type: 'FETCH_SUCCESS', profile }))
      .catch(() => dispatch({ type: 'FETCH_ERROR' }))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const setProfile = useCallback(
    (profile: AccountProfile) => dispatch({ type: 'SET_PROFILE', profile }),
    [],
  )

  return { profile: state.profile, status: state.status, reload, setProfile }
}
