import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import { handleApiError } from '../../../shared/infraestructure/errors/handle-api-error'
import type { AuthRepository as AuthRepositoryContract } from '../../domain/auth.repository'
import type { AuthSession } from '../../domain/auth-session.model'
import type { LoginResponseDto } from '../dto/login.response.dto'
import { AuthMapper } from '../mappers/auth.mapper'

class AuthRepositoryImpl implements AuthRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async login(identifier: string, password: string): Promise<AuthSession> {
    try {
      const response = await this.datasource.post<LoginResponseDto>('/login', { identifier, password })
      return AuthMapper.toAuthSession(response)
    } catch (error) {
      handleApiError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await this.datasource.post('/logout')
    } catch {
      // El servidor puede rechazar un token ya expirado (401); la sesión local se limpia igual.
    }
  }
}

export const authRepository = new AuthRepositoryImpl()
