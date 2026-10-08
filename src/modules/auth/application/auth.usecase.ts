import type { AuthRepository } from '../domain/auth.repository'
import type { AuthSession } from '../domain/auth-session.model'
import { AuthSessionStorage } from '../infraestructure/storage/auth-session.storage'

export class AuthUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async login(
    identifier: string,
    password: string,
    keepSession: boolean = false,
  ): Promise<AuthSession> {
    const session = await this.repository.login(identifier, password)
    AuthSessionStorage.save(session)

    if (!keepSession) return session

    try {
      const trustedExpiresAt = await this.repository.trustClient()
      AuthSessionStorage.updateExpiresAt(trustedExpiresAt)
      return { ...session, expiresAt: trustedExpiresAt }
    } catch {
      return session
    }
  }

  async logout(): Promise<void> {
    try {
      await this.repository.logout()
    } finally {
      AuthSessionStorage.clear()
    }
  }
}
