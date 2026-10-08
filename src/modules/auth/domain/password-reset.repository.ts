import type { ResetPasswordInput } from './reset-password-input.model'

export interface PasswordResetRepository {
  requestReset(email: string): Promise<void>
  resetPassword(input: ResetPasswordInput): Promise<void>
}
