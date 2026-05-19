import type { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import { handleApiError } from '../../../shared/infraestructure/errors/handle-api-error'
import { StorageService } from '../../../shared/infraestructure/storage/local.storage'
import type { UserRepository as UserRepositoryContract } from '../../domain/auth.repository'
import type { User } from '../../domain/user.entity'
import type { LoginResponseDto } from '../dto/ogin.response.dto'
import { AuthMapper } from '../mappers/auth.mapper'

export class AuthRepository implements UserRepositoryContract {
  constructor (private readonly datasource: HttpDataSource) {}
  async authenticate (emailOrPhone: string, password: string): Promise<User> {
    try {
      const response = await this.datasource.post<LoginResponseDto>(
        '/auth/login',
        {
          emailOrPhone,
          password
        }
      )
      StorageService.set('access_token', response.access_token)

      return AuthMapper.toUserEntity(response.user)
    } catch (error) {
      handleApiError(error)
    }
  }
  findByEmail (_email: string, _password: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
