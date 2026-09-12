import { useEffect, useMemo, useReducer, useRef } from 'react'
import { notificationsRepository } from '../../repositories/notifications.repository'
import { INITIAL_NOTIFICATIONS_TRAY_STATE } from './notifications-tray.model'
import { notificationsTrayReducer } from './notifications-tray.reducer'

export function useNotificationsTray() {
  const [state, dispatch] = useReducer(notificationsTrayReducer, INITIAL_NOTIFICATIONS_TRAY_STATE)
  const sequenceRef = useRef(0)

  useEffect(() => {
    const sequence = ++sequenceRef.current
    dispatch({ type: 'FETCH_START' })
    notificationsRepository
      .list()
      .then((page) => {
        if (sequence === sequenceRef.current) {
          dispatch({ type: 'FETCH_SUCCESS', notifications: page.notifications })
        }
      })
      .catch(() => {
        if (sequence === sequenceRef.current) dispatch({ type: 'FETCH_ERROR' })
      })
  }, [])

  const unreadCount = useMemo(
    () => state.notifications.filter((notification) => notification.readAt === null).length,
    [state.notifications],
  )

  const markAsRead = (id: string): void => {
    const notification = state.notifications.find((item) => item.id === id)
    if (!notification || notification.readAt !== null) return

    const readAt = new Date().toISOString()
    dispatch({ type: 'SET_READ_AT', id, readAt })
    notificationsRepository.markRead(id).catch(() => {
      dispatch({ type: 'SET_READ_AT', id, readAt: null })
    })
  }

  return { status: state.status, notifications: state.notifications, unreadCount, markAsRead }
}
