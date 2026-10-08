import type { PasswordResetErrorReport } from '../domain/password-reset-error.model'

export type ResetPasswordStatus = 'idle' | 'submitting' | 'done'

export interface ResetPasswordState {
  status: ResetPasswordStatus
  error: PasswordResetErrorReport | null
}

export const INITIAL_RESET_PASSWORD_STATE: ResetPasswordState = {
  status: 'idle',
  error: null,
}
