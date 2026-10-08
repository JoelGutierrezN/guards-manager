import { AuthSessionStorage } from '../infraestructure/storage/auth-session.storage'
import type { AuthState } from './auth-state.interfaces'

export class AuthInitialStateHelper {
  static build(): AuthState {
    const session = AuthSessionStorage.read()
    if (!session) {
      return {
        user: null,
        token: null,
        expiresAt: null,
        status: 'idle',
        error: null,
        sessionExpired: false,
      }
    }
    return {
      user: session.user,
      token: session.token,
      expiresAt: session.expiresAt,
      status: 'authenticated',
      error: null,
      sessionExpired: false,
    }
  }
}
