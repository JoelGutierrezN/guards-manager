import type { Pagination } from '../../shared/domain/pagination.model'
import type { User } from './user.entity'

export interface UsersListPage extends Pagination {
  users: User[]
}
