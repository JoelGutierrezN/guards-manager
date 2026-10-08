import { type JSX, useState } from 'react'
import { InboxIcon } from '@hugeicons/core-free-icons'
import { TopbarIconButton } from './topbar-icon-button.component'
import { TopbarNotificationsPanel } from './topbar-notifications-panel.component'
import { useNotificationsTray } from './use-notifications-tray.hook'

export function TopbarNotifications(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { status, notifications, unreadCount, markAsRead, reload } = useNotificationsTray()

  return (
    <div className="relative">
      <TopbarIconButton
        icon={InboxIcon}
        tip="Notificaciones"
        active={isPanelOpen}
        badge={unreadCount > 0 ? unreadCount : undefined}
        onClick={() => setIsPanelOpen((current) => !current)}
      />
      {isPanelOpen && (
        <TopbarNotificationsPanel
          notifications={notifications}
          status={status}
          onClose={() => setIsPanelOpen(false)}
          onRetry={reload}
          onMarkAsRead={markAsRead}
        />
      )}
    </div>
  )
}
