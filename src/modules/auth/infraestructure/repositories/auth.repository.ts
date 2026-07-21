import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
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
    const response = await this.datasource.post<LoginResponseDto>('/login', { identifier, password })
    return AuthMapper.toAuthSession(response)
  }

  async logout(): Promise<void> {
    await this.datasource.post('/logout')
  }
}

export const authRepository = new AuthRepositoryImpl()
