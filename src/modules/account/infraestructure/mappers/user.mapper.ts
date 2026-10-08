import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { User } from '../../domain/user.entity'
import type { UsersListPage } from '../../domain/users-list-page.model'
import type { CreateUserInput, UpdateUserInput } from '../../domain/user-input.model'
import type { UserCollectionDto, UserDto, UserRequestDto } from '../dto/user.dto'

export class UserMapper {
  static toCreateRequestBody(input: CreateUserInput): UserRequestDto {
    return {
      name: input.name,
      email: input.email,
      username: input.username,
      phone: input.phone,
      password: input.password,
    }
  }

  static toUpdateRequestBody(input: UpdateUserInput): UserRequestDto {
    const body: UserRequestDto = {
      name: input.name,
      email: input.email,
      username: input.username,
      phone: input.phone,
    }
    if (input.password != null && input.password !== '') body.password = input.password
    return body
  }

  static toUser(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone ?? null,
      createdAt: dto.createdAt,
    }
  }

  static toUsersListPage(dto: UserCollectionDto): UsersListPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      users: dto.data.map((user) => UserMapper.toUser(user)),
    }
  }
}
