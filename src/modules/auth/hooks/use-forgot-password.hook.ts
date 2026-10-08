import { useCallback, useState } from 'react'
import {
  INITIAL_FORGOT_PASSWORD_STATE,
  type ForgotPasswordState,
} from '../application/forgot-password-state.model'
import { PasswordResetErrorHelper } from '../infraestructure/helpers/password-reset-error.helper'
import { passwordResetRepository } from '../infraestructure/repositories/password-reset.repository'

export function useForgotPassword() {
  const [state, setState] = useState<ForgotPasswordState>(INITIAL_FORGOT_PASSWORD_STATE)

  const submit = useCallback(async (email: string): Promise<boolean> => {
    setState({ status: 'submitting', error: null })
    try {
      await passwordResetRepository.requestReset(email)
      setState({ status: 'done', error: null })
      return true
    } catch (error: unknown) {
      setState({ status: 'idle', error: PasswordResetErrorHelper.forgotReportFrom(error) })
      return false
    }
  }, [])

  return { state, submit }
}
