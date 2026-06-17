import { User } from '../../domain/user.entity'
import type { AuthSession } from '../../domain/auth-session.model'
import type { UserPrimitives } from '../../domain/user.interfaces'
import { StorageService } from '../../../shared/infraestructure/storage/local.storage'

export class AuthSessionStorage {
  static save(session: AuthSession): void {
    StorageService.set('access_token', session.token)
    StorageService.set('auth_user', session.user.toPrimitives())
  }

  static read(): AuthSession | null {
    try {
      const token = StorageService.get<string>('access_token')
      const primitives = StorageService.get<UserPrimitives>('auth_user')

      if (!token || !primitives) return null

      return { user: User.fromPrimitives(primitives), token }
    } catch {
      AuthSessionStorage.clear()
      return null
    }
  }

  static clear(): void {
    StorageService.remove('access_token')
    StorageService.remove('auth_user')
  }
}
