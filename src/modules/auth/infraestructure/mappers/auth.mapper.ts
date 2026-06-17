import { User } from '../../domain/user.entity'
import type { AuthSession } from '../../domain/auth-session.model'
import type { LoginResponseDto } from '../dto/login.response.dto'

export class AuthMapper {
  static toUserEntity(dto: LoginResponseDto['user']): User {
    return User.create({
      uuid: dto.uuid,
      email: dto.email,
      name: dto.name,
      username: dto.username,
      phone: dto.phone,
    })
  }

  static toAuthSession(dto: LoginResponseDto): AuthSession {
    return {
      user: AuthMapper.toUserEntity(dto.user),
      token: dto.token,
    }
  }
}
