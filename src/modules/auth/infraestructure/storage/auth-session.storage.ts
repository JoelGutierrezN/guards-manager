import { User } from '../../domain/user.entity'
import type { AuthSession } from '../../domain/auth-session.model'
import type { UserPrimitives } from '../../domain/user.interfaces'
import { StorageService } from '../../../shared/infraestructure/storage/local.storage'

const ACCESS_TOKEN_KEY = 'access_token'
const AUTH_USER_KEY = 'auth_user'
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'access_token_expires_at'

export class AuthSessionStorage {
  static save(session: AuthSession): void {
    StorageService.set(ACCESS_TOKEN_KEY, session.token)
    StorageService.set(AUTH_USER_KEY, session.user.toPrimitives())
    StorageService.set(ACCESS_TOKEN_EXPIRES_AT_KEY, session.expiresAt)
  }

  static updateExpiresAt(expiresAt: string): void {
    StorageService.set(ACCESS_TOKEN_EXPIRES_AT_KEY, expiresAt)
  }

  static read(): AuthSession | null {
    try {
      const token = StorageService.get<string>(ACCESS_TOKEN_KEY)
      const primitives = StorageService.get<UserPrimitives>(AUTH_USER_KEY)
      const expiresAt = StorageService.get<string>(ACCESS_TOKEN_EXPIRES_AT_KEY)

      // Una sesión legada (sin `id` o sin `expiresAt`) se descarta y se borra: si el token viejo
      // siguiera guardado, el interceptor lo adjuntaría incluso en `POST /login` y la ruta `guest`
      // respondería con una redirección en lugar de la sesión nueva.
      if (!token || !primitives || !primitives.id || !expiresAt) {
        AuthSessionStorage.clear()
        return null
      }

      return { user: User.fromPrimitives(primitives), token, expiresAt }
    } catch {
      AuthSessionStorage.clear()
      return null
    }
  }

  static clear(): void {
    StorageService.remove(ACCESS_TOKEN_KEY)
    StorageService.remove(AUTH_USER_KEY)
    StorageService.remove(ACCESS_TOKEN_EXPIRES_AT_KEY)
  }
}
