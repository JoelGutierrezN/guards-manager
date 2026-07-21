import type { Dispatch } from 'react'
import type { User } from '../../domain/user.entity'
import type { AuthStatus, AuthAction } from '../../application/auth-state.interfaces'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  status: AuthStatus
  error: string | null
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
  dispatch: Dispatch<AuthAction>
}
