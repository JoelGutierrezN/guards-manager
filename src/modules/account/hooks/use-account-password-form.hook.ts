import { useCallback, useMemo, useReducer } from 'react'
import { accountPasswordFormReducer } from '../application/account-password-form.reducer'
import { AccountPasswordFormHelper } from '../application/account-password-form.helper'
import { AccountPasswordFormErrorHelper } from '../infraestructure/helpers/account-password-form-error.helper'
import { accountRepository } from '../infraestructure/repositories/account.repository'

interface UseAccountPasswordFormOptions {
  onSaved: () => void
}

export function useAccountPasswordForm({ onSaved }: UseAccountPasswordFormOptions) {
  const [state, dispatch] = useReducer(
    accountPasswordFormReducer,
    undefined,
    AccountPasswordFormHelper.initialState,
  )

  const localErrors = useMemo(() => AccountPasswordFormHelper.validate(state), [state])

  const visibleErrors = useMemo(
    () => AccountPasswordFormHelper.mergeErrors(state.touched ? localErrors : {}, state.apiErrors),
    [state.touched, localErrors, state.apiErrors],
  )

  const canSave = useMemo(
    () => !AccountPasswordFormHelper.hasErrors(localErrors) && !state.isSaving,
    [localErrors, state.isSaving],
  )

  const setCurrentPassword = useCallback(
    (currentPassword: string) => dispatch({ type: 'SET_CURRENT_PASSWORD', currentPassword }),
    [],
  )
  const setPassword = useCallback(
    (password: string) => dispatch({ type: 'SET_PASSWORD', password }),
    [],
  )
  const setPasswordConfirmation = useCallback(
    (passwordConfirmation: string) =>
      dispatch({ type: 'SET_PASSWORD_CONFIRMATION', passwordConfirmation }),
    [],
  )

  const submit = useCallback(async () => {
    dispatch({ type: 'TOUCH' })
    if (AccountPasswordFormHelper.hasErrors(localErrors) || state.isSaving) return
    dispatch({ type: 'SAVE_START' })
    try {
      await accountRepository.changePassword(AccountPasswordFormHelper.toInput(state))
      dispatch({ type: 'SAVE_DONE' })
      onSaved()
    } catch (error) {
      dispatch({
        type: 'SAVE_ERROR',
        errors: AccountPasswordFormErrorHelper.fieldErrorsFrom(error),
        message: AccountPasswordFormErrorHelper.messageFrom(error),
      })
    }
  }, [localErrors, state, onSaved])

  return {
    state,
    visibleErrors,
    canSave,
    setCurrentPassword,
    setPassword,
    setPasswordConfirmation,
    submit,
  }
}
