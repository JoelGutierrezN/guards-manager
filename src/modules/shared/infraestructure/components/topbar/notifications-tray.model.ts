import type { Notification } from '../../../domain/notification.model'

export type NotificationsTrayStatus = 'idle' | 'loading' | 'success' | 'error'

export interface NotificationsTrayState {
  status: NotificationsTrayStatus
  notifications: Notification[]
}

export const INITIAL_NOTIFICATIONS_TRAY_STATE: NotificationsTrayState = {
  status: 'idle',
  notifications: [],
}
