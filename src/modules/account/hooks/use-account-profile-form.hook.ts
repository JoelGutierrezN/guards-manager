import { useCallback, useEffect, useMemo, useReducer } from 'react'
import type { AccountProfile } from '../domain/account-profile.model'
import { accountProfileFormReducer } from '../application/account-profile-form.reducer'
import { AccountProfileFormHelper } from '../application/account-profile-form.helper'
import { AccountProfileFormErrorHelper } from '../infraestructure/helpers/account-profile-form-error.helper'
import { accountRepository } from '../infraestructure/repositories/account.repository'

interface UseAccountProfileFormOptions {
  profile: AccountProfile | null
  onSaved: (profile: AccountProfile) => void
}

export function useAccountProfileForm({ profile, onSaved }: UseAccountProfileFormOptions) {
  const [state, dispatch] = useReducer(
    accountProfileFormReducer,
    profile,
    AccountProfileFormHelper.initialStateFrom,
  )

  useEffect(() => {
    if (profile !== null) dispatch({ type: 'HYDRATE', profile })
  }, [profile])

  const localErrors = useMemo(() => AccountProfileFormHelper.validate(state), [state])

  const visibleErrors = useMemo(
    () => AccountProfileFormHelper.mergeErrors(state.touched ? localErrors : {}, state.apiErrors),
    [state.touched, localErrors, state.apiErrors],
  )

  const canSave = useMemo(
    () => !AccountProfileFormHelper.hasErrors(localErrors) && !state.isSaving,
    [localErrors, state.isSaving],
  )

  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), [])
  const setEmail = useCallback((email: string) => dispatch({ type: 'SET_EMAIL', email }), [])
  const setUsername = useCallback(
    (username: string) => dispatch({ type: 'SET_USERNAME', username }),
    [],
  )
  const setPhone = useCallback((phone: string) => dispatch({ type: 'SET_PHONE', phone }), [])

  const submit = useCallback(async () => {
    dispatch({ type: 'TOUCH' })
    if (AccountProfileFormHelper.hasErrors(localErrors) || state.isSaving) return
    dispatch({ type: 'SAVE_START' })
    try {
      const updatedProfile = await accountRepository.updateMe(
        AccountProfileFormHelper.toInput(state),
      )
      dispatch({ type: 'SAVE_DONE' })
      onSaved(updatedProfile)
    } catch (error) {
      dispatch({
        type: 'SAVE_ERROR',
        errors: AccountProfileFormErrorHelper.fieldErrorsFrom(error),
        message: AccountProfileFormErrorHelper.messageFrom(error),
      })
    }
  }, [localErrors, state, onSaved])

  return { state, visibleErrors, canSave, setName, setEmail, setUsername, setPhone, submit }
}
