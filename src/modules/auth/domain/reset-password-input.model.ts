import type { ResetPasswordLinkParams } from './reset-password-link.model'

export interface ResetPasswordInput extends ResetPasswordLinkParams {
  password: string
  passwordConfirmation: string
}
