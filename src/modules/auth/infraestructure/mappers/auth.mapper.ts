// modules/auth/infrastructure/mappers/auth.mapper.ts

import { User } from '../../domain/user.entity'
import type { LoginResponseDto } from '../dto/ogin.response.dto'

export class AuthMapper {
  static toUserEntity (user: LoginResponseDto['user']): User {
    return User.create({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone
    })
  }
}
