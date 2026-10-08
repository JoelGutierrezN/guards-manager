import type { User } from './user.entity'
import type { CreateUserInput, UpdateUserInput } from './user-input.model'
import type { UsersListPage } from './users-list-page.model'

export interface UsersRepository {
  list(params: URLSearchParams): Promise<UsersListPage>
  create(input: CreateUserInput): Promise<User>
  update(id: string, input: UpdateUserInput): Promise<User>
  remove(id: string): Promise<void>
}
