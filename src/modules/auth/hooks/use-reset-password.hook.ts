import { useCallback, useState } from 'react'
import type { ResetPasswordLinkParams } from '../domain/reset-password-link.model'
import {
  INITIAL_RESET_PASSWORD_STATE,
  type ResetPasswordState,
} from '../application/reset-password-state.model'
import { PasswordResetErrorHelper } from '../infraestructure/helpers/password-reset-error.helper'
import { passwordResetRepository } from '../infraestructure/repositories/password-reset.repository'

export function useResetPassword(linkParams: ResetPasswordLinkParams) {
  const [state, setState] = useState<ResetPasswordState>(INITIAL_RESET_PASSWORD_STATE)

  const submit = useCallback(
    async (password: string, passwordConfirmation: string): Promise<boolean> => {
      setState({ status: 'submitting', error: null })
      try {
        await passwordResetRepository.resetPassword({
          ...linkParams,
          password,
          passwordConfirmation,
        })
        setState({ status: 'done', error: null })
        return true
      } catch (error: unknown) {
        setState({ status: 'idle', error: PasswordResetErrorHelper.resetReportFrom(error) })
        return false
      }
    },
    [linkParams],
  )

  return { state, submit }
}
