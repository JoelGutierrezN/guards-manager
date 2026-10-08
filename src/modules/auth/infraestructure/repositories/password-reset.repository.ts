import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { PasswordResetRepository as PasswordResetRepositoryContract } from '../../domain/password-reset.repository'
import type { ResetPasswordInput } from '../../domain/reset-password-input.model'

class PasswordResetRepositoryImpl implements PasswordResetRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async requestReset(email: string): Promise<void> {
    await this.datasource.post('/forgot-password', { email })
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await this.datasource.post('/reset-password', {
      token: input.token,
      email: input.email,
      expires: input.expires,
      signature: input.signature,
      password: input.password,
      password_confirmation: input.passwordConfirmation,
    })
  }
}

export const passwordResetRepository = new PasswordResetRepositoryImpl()
