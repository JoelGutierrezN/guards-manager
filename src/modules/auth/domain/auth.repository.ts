import type { User } from './user.entity'

export interface AuthRepository {
  authenticate(emailOrPhone: string, password: string): Promise<User>
  findByEmail(email: string, password: string): Promise<string>
}
