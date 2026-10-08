import type { Pagination } from './pagination.model'
import type { Notification } from './notification.model'

export interface NotificationsListPage extends Pagination {
  notifications: Notification[]
}
