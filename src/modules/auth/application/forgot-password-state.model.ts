import type { PasswordResetErrorReport } from '../domain/password-reset-error.model'

export type ForgotPasswordStatus = 'idle' | 'submitting' | 'done'

export interface ForgotPasswordState {
  status: ForgotPasswordStatus
  error: PasswordResetErrorReport | null
}

export const INITIAL_FORGOT_PASSWORD_STATE: ForgotPasswordState = {
  status: 'idle',
  error: null,
}
