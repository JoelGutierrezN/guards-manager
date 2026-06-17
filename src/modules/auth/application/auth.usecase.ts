import type { AuthRepository } from '../domain/auth.repository'
import type { AuthSession } from '../domain/auth-session.model'
import { AuthSessionStorage } from '../infraestructure/storage/auth-session.storage'

export class AuthUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async login(identifier: string, password: string): Promise<AuthSession> {
    const session = await this.repository.login(identifier, password)
    AuthSessionStorage.save(session)
    return session
  }

  async logout(): Promise<void> {
    await this.repository.logout()
    AuthSessionStorage.clear()
  }
}
