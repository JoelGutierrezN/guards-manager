import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { UsersRepository as UsersRepositoryContract } from '../../domain/users-repository'
import type { User } from '../../domain/user.entity'
import type { CreateUserInput, UpdateUserInput } from '../../domain/user-input.model'
import type { UsersListPage } from '../../domain/users-list-page.model'
import type { UserCollectionDto, UserDto } from '../dto/user.dto'
import { UserMapper } from '../mappers/user.mapper'

class UsersRepositoryImpl implements UsersRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(params: URLSearchParams): Promise<UsersListPage> {
    const response = await this.datasource.get<UserCollectionDto>(`/users?${params.toString()}`)
    return UserMapper.toUsersListPage(response)
  }

  async create(input: CreateUserInput): Promise<User> {
    const response = await this.datasource.post<UserDto>(
      '/users',
      UserMapper.toCreateRequestBody(input),
    )
    return UserMapper.toUser(response)
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const response = await this.datasource.patch<UserDto>(
      `/users/${id}`,
      UserMapper.toUpdateRequestBody(input),
    )
    return UserMapper.toUser(response)
  }

  async remove(id: string): Promise<void> {
    await this.datasource.delete<void>(`/users/${id}`)
  }
}

export const usersRepository = new UsersRepositoryImpl()
