import { useCallback, useEffect, useMemo, useReducer } from 'react'
import type { User } from '../domain/user.entity'
import type { CreateUserInput, UpdateUserInput } from '../domain/user-input.model'
import type { UserFormErrors } from '../application/user-form.model'
import { userFormReducer } from '../application/user-form.reducer'
import { UserFormHelper } from '../application/user-form.helper'

interface UseUserFormOptions {
  editUser: User | null
  apiErrors: UserFormErrors
  onSave: (input: CreateUserInput | UpdateUserInput) => void
}

export function useUserForm({ editUser, apiErrors, onSave }: UseUserFormOptions) {
  const isEdit = editUser != null
  const [state, dispatch] = useReducer(userFormReducer, editUser, UserFormHelper.initialStateFrom)

  useEffect(() => {
    dispatch({ type: 'SET_API_ERRORS', errors: apiErrors })
  }, [apiErrors])

  const localErrors = useMemo(() => UserFormHelper.validate(state, isEdit), [state, isEdit])
  const visibleErrors = useMemo<UserFormErrors>(
    () => UserFormHelper.mergeErrors(state.touched ? localErrors : {}, state.apiErrors),
    [state.touched, state.apiErrors, localErrors],
  )
  const canSave = useMemo(() => !UserFormHelper.hasErrors(localErrors), [localErrors])

  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), [])
  const setEmail = useCallback((email: string) => dispatch({ type: 'SET_EMAIL', email }), [])
  const setUsername = useCallback(
    (username: string) => dispatch({ type: 'SET_USERNAME', username }),
    [],
  )
  const setPhone = useCallback((phone: string) => dispatch({ type: 'SET_PHONE', phone }), [])
  const setPassword = useCallback(
    (password: string) => dispatch({ type: 'SET_PASSWORD', password }),
    [],
  )

  const submit = useCallback(() => {
    dispatch({ type: 'TOUCH' })
    if (!canSave) return
    onSave(isEdit ? UserFormHelper.toUpdateInput(state) : UserFormHelper.toCreateInput(state))
  }, [canSave, isEdit, state, onSave])

  return {
    state,
    isEdit,
    visibleErrors,
    canSave,
    setName,
    setEmail,
    setUsername,
    setPhone,
    setPassword,
    submit,
  }
}
