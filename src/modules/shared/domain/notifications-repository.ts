import type { NotificationsListPage } from './notifications-list-page.model'

export interface NotificationsRepository {
  list(unreadOnly?: boolean): Promise<NotificationsListPage>
  markRead(id: string): Promise<void>
}
