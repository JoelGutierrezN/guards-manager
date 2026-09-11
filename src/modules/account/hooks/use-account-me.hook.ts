import { useEffect, useReducer } from 'react'
import type { AccountProfile } from '../domain/account-profile.model'
import type { AccountMeStatus } from '../application/account-me.model'
import { accountMeReducer } from '../application/account-me.reducer'
import { accountRepository } from '../infraestructure/repositories/account.repository'

interface UseAccountMeResult {
  profile: AccountProfile | null
  status: AccountMeStatus
  setProfile: (profile: AccountProfile) => void
}

export function useAccountMe(): UseAccountMeResult {
  const [state, dispatch] = useReducer(accountMeReducer, { profile: null, status: 'idle' })

  useEffect(() => {
    let isActive = true
    dispatch({ type: 'FETCH_START' })
    accountRepository
      .getMe()
      .then((profile) => {
        if (isActive) dispatch({ type: 'FETCH_SUCCESS', profile })
      })
      .catch(() => {
        if (isActive) dispatch({ type: 'FETCH_ERROR' })
      })
    return () => {
      isActive = false
    }
  }, [])

  return {
    profile: state.profile,
    status: state.status,
    setProfile: (profile: AccountProfile) => dispatch({ type: 'SET_PROFILE', profile }),
  }
}
