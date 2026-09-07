import type { User } from '../../domain/user.entity'
import type { AuthStatus } from '../../application/auth-state.interfaces'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  status: AuthStatus
  error: string | null
  login: (identifier: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  sessionExpired: boolean
}
