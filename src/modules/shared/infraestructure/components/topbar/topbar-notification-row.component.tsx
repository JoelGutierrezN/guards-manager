import { type JSX } from 'react'
import { cn } from '../../utils/cn'
import type { Notification } from '../../../domain/notification.model'

interface Props {
  notification: Notification
  onClick: (id: string) => void
}

export function TopbarNotificationRow({ notification, onClick }: Props): JSX.Element {
  const isUnread = notification.readAt === null

  return (
    <button
      type="button"
      onClick={() => onClick(notification.id)}
      className={cn(
        'flex w-full flex-col gap-0.5 rounded-[14px] px-3 py-2.5 text-left transition-colors hover:bg-brand-soft',
        isUnread && 'bg-brand-soft-2',
      )}
    >
      <div className="flex items-center gap-2">
        {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
        <span className="text-[13px] font-semibold text-ink">{notification.title}</span>
      </div>
      <span className="text-[12px] leading-[1.4] text-ink-3">{notification.body}</span>
    </button>
  )
}
