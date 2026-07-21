import type { User } from '../domain/user.entity'
import type { AuthSession } from '../domain/auth-session.model'

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error'

export interface AuthState {
  user: User | null
  token: string | null
  status: AuthStatus
  error: string | null
  sessionExpired: boolean
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthSession }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_SESSION_EXPIRED' }
