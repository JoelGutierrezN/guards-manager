import { useCallback, useReducer } from 'react'
import {
  INITIAL_USER_DELETE_STATE,
  type UserDeleteTarget,
} from '../application/user-delete-state.model'
import { userDeleteReducer } from '../application/user-delete.reducer'
import { usersRepository } from '../infraestructure/repositories/users.repository'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'

const DELETE_FALLBACK_MESSAGE = 'No se pudo eliminar al usuario.'

interface UseUserDeleteOptions {
  onDeleted: (target: UserDeleteTarget) => void
}

export function useUserDelete({ onDeleted }: UseUserDeleteOptions) {
  const [state, dispatch] = useReducer(userDeleteReducer, INITIAL_USER_DELETE_STATE)
  const { target } = state

  const openConfirm = useCallback(
    (user: UserDeleteTarget) => dispatch({ type: 'OPEN_CONFIRM', target: user }),
    [],
  )
  const closeConfirm = useCallback(() => dispatch({ type: 'CLOSE_CONFIRM' }), [])

  const confirm = useCallback(async () => {
    if (target === null) return
    dispatch({ type: 'ACTION_START' })
    try {
      await usersRepository.remove(target.id)
      dispatch({ type: 'ACTION_SUCCESS' })
      onDeleted(target)
    } catch (error) {
      const message = ApiConflictErrorHelper.isConflict(error)
        ? ApiConflictErrorHelper.messageFrom(error, DELETE_FALLBACK_MESSAGE)
        : DELETE_FALLBACK_MESSAGE
      dispatch({ type: 'ACTION_ERROR', message })
    }
  }, [target, onDeleted])

  return {
    target,
    loading: state.loading,
    errorMessage: state.errorMessage,
    openConfirm,
    closeConfirm,
    confirm,
  }
}
