import type { Notification } from '../../../domain/notification.model'
import type { NotificationsTrayState } from './notifications-tray.model'

export type NotificationsTrayAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; notifications: Notification[] }
  | { type: 'FETCH_ERROR' }
  | { type: 'SET_READ_AT'; id: string; readAt: string | null }

export function notificationsTrayReducer(
  state: NotificationsTrayState,
  action: NotificationsTrayAction,
): NotificationsTrayState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading' }
    case 'FETCH_SUCCESS':
      return { status: 'success', notifications: action.notifications }
    case 'FETCH_ERROR':
      return { status: 'error', notifications: [] }
    case 'SET_READ_AT':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.id ? { ...notification, readAt: action.readAt } : notification,
        ),
      }
  }
}
