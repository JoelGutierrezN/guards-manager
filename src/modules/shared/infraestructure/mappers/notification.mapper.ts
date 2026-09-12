import { PaginationMapper } from './pagination.mapper'
import type { Notification } from '../../domain/notification.model'
import type { NotificationsListPage } from '../../domain/notifications-list-page.model'
import type { NotificationCollectionDto, NotificationDto } from '../dto/notification.dto'

export class NotificationMapper {
  static toNotification(dto: NotificationDto): Notification {
    return {
      id: dto.id,
      type: dto.type,
      title: dto.title,
      body: dto.body,
      readAt: dto.readAt ?? null,
      createdAt: dto.createdAt,
    }
  }

  static toNotificationsListPage(dto: NotificationCollectionDto): NotificationsListPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      notifications: dto.data.map((notification) =>
        NotificationMapper.toNotification(notification),
      ),
    }
  }
}
