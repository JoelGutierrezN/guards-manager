import { type JSX } from 'react'
import { ArrowUp01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar } from '../ui'
import { useAccountMe } from '../../../../account/hooks/use-account-me.hook'
import { useAuth } from '../../../../auth/hooks/use-auth.hook'

interface Props {
  onLogout: () => void
}

export function SidebarUserCard({ onLogout }: Props): JSX.Element {
  const { profile } = useAccountMe()
  const { user } = useAuth()
  const name = profile?.name ?? user?.getName() ?? '—'
  const subtitle = profile?.username ?? profile?.email ?? ''

  return (
    <div className="mt-auto border-t border-lavender-line pt-3">
      <div className="flex w-full items-center gap-2.5 rounded-[14px] px-2 py-1.5">
        <Avatar name={name} size="sm" tone="navy" />
        <div className="min-w-0 flex-1 text-left group-data-[collapsed=true]/sidebar:hidden">
          <b className="block truncate text-[12px] font-semibold text-ink">{name}</b>
          <span className="block truncate font-mono text-[10px] tracking-[0.06em] text-muted">
            {subtitle}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 text-muted-soft transition-colors hover:text-destructive group-data-[collapsed=true]/sidebar:hidden"
          aria-label="Cerrar sesión"
        >
          <HugeiconsIcon icon={Logout01Icon} size={14} strokeWidth={1.8} />
        </button>
        <span className="shrink-0 text-muted-soft group-data-[collapsed=true]/sidebar:hidden">
          <HugeiconsIcon icon={ArrowUp01Icon} size={12} strokeWidth={1.8} />
        </span>
      </div>
    </div>
  )
}
