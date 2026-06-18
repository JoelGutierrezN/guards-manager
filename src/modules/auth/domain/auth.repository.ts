import type { AuthSession } from './auth-session.model'

export interface AuthRepository {
  login(identifier: string, password: string): Promise<AuthSession>
  logout(): Promise<void>
}
