import { HttpDataSource } from '../datasource/http.datasource'
import type { NotificationsRepository as NotificationsRepositoryContract } from '../../domain/notifications-repository'
import type { NotificationsListPage } from '../../domain/notifications-list-page.model'
import type { NotificationCollectionDto } from '../dto/notification.dto'
import { NotificationMapper } from '../mappers/notification.mapper'

class NotificationsRepositoryImpl implements NotificationsRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(unreadOnly = false): Promise<NotificationsListPage> {
    const params = new URLSearchParams()
    if (unreadOnly) params.set('unread', '1')
    const query = params.toString()
    const response = await this.datasource.get<NotificationCollectionDto>(
      query === '' ? '/notifications' : `/notifications?${query}`,
    )
    return NotificationMapper.toNotificationsListPage(response)
  }

  async markRead(id: string): Promise<void> {
    await this.datasource.post<void>(`/notifications/${id}/read`)
  }
}

export const notificationsRepository = new NotificationsRepositoryImpl()
