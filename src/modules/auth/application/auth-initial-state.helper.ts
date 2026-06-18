import { AuthSessionStorage } from '../infraestructure/storage/auth-session.storage'
import type { AuthState } from './auth-state.interfaces'

export class AuthInitialStateHelper {
  static build(): AuthState {
    const session = AuthSessionStorage.read()
    if (!session) return { user: null, token: null, status: 'idle', error: null }
    return { user: session.user, token: session.token, status: 'authenticated', error: null }
  }
}
