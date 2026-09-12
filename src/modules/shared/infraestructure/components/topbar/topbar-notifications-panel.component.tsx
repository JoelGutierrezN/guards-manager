import { type JSX } from 'react'
import { TopbarNotificationRow } from './topbar-notification-row.component'
import type { Notification } from '../../../domain/notification.model'

interface Props {
  notifications: Notification[]
  isLoading: boolean
  onClose: () => void
  onMarkAsRead: (id: string) => void
}

export function TopbarNotificationsPanel({
  notifications,
  isLoading,
  onClose,
  onMarkAsRead,
}: Props): JSX.Element {
  return (
    <>
      <button
        type="button"
        aria-label="Cerrar notificaciones"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />
      <div
        role="dialog"
        aria-label="Notificaciones"
        className="absolute top-[calc(100%+8px)] right-0 z-50 flex max-h-[420px] w-[340px] flex-col gap-1 overflow-y-auto rounded-[20px] border border-hairline bg-white p-2 shadow-[0_36px_70px_-18px_rgba(14,15,60,0.3),0_12px_26px_-8px_rgba(14,15,60,0.12)]"
      >
        {isLoading && <div className="px-3 py-6 text-center text-[12px] text-muted">Cargando…</div>}
        {!isLoading && notifications.length === 0 && (
          <div className="px-3 py-6 text-center text-[12px] text-muted">Sin notificaciones.</div>
        )}
        {!isLoading &&
          notifications.map((notification) => (
            <TopbarNotificationRow
              key={notification.id}
              notification={notification}
              onClick={onMarkAsRead}
            />
          ))}
      </div>
    </>
  )
}
