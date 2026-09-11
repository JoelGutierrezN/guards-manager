import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface UserDto {
  id: string
  name: string
  username: string
  email: string
  phone: string | null
  createdAt: string
}

export interface UserRequestDto {
  name: string
  email: string
  username: string
  phone: string | null
  password?: string
}

export interface UserCollectionDto {
  data: UserDto[]
  meta: PaginationMetaDto
}
