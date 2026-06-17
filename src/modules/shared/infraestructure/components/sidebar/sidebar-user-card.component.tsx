import { type JSX } from 'react'
import { ArrowUp01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface Props {
  name: string
  role: string
  onLogout: () => void
}

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '·'

export function SidebarUserCard({ name, role, onLogout }: Props): JSX.Element {
  return (
    <div className="mt-auto border-t border-lavender-line pt-3">
      <div className="flex w-full items-center gap-2.5 rounded-[14px] px-2 py-1.5">
        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-medium text-cream">
          {initials(name)}
        </span>
        <div className="min-w-0 flex-1 text-left group-data-[collapsed=true]/sidebar:hidden">
          <b className="block truncate text-[12px] font-semibold text-ink">{name}</b>
          <span className="block truncate font-mono text-[10px] tracking-[0.06em] text-muted">
            {role}
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
