import type { PaginationMetaDto } from './pagination-meta.dto'

export interface NotificationDto {
  id: string
  type: string
  title: string
  body: string
  readAt: string | null
  createdAt: string
  data: unknown
}

export interface NotificationCollectionDto {
  data: NotificationDto[]
  meta: PaginationMetaDto
}
