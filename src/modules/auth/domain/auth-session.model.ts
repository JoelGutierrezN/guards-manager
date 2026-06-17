import type { User } from './user.entity'

export interface AuthSession {
  user: User
  token: string
}
