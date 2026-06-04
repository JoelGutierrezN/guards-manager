import { type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { SidebarItem } from './sidebar.routes'

interface SidebarNavItemProps {
  item: SidebarItem
  active: boolean
  featured?: boolean
  collapsed: boolean
  onSelect: (id: string) => void
}

export function SidebarNavItem({
  item,
  active,
  featured = false,
  collapsed,
  onSelect,
}: SidebarNavItemProps): JSX.Element {
  const iconColor = featured
    ? active
      ? 'text-white'
      : 'text-brand'
    : active
      ? 'text-brand'
      : 'text-ink-3 group-hover/item:text-ink'

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group/item relative mb-px flex w-full items-center gap-2.5 rounded-[10px] px-2 py-[7px] text-left text-[13px] transition-colors',
        'group-data-[collapsed=true]/sidebar:justify-center',
        featured
          ? active
            ? 'nav-item-featured-shadow bg-brand font-semibold text-white'
            : 'font-semibold text-brand hover:bg-brand-soft-2 hover:text-brand-active'
          : active
            ? 'nav-item-active-shadow bg-white font-medium text-brand-active'
            : 'font-medium text-ink-3 hover:bg-white/55 hover:text-ink',
      )}
    >
      <span className={cn('flex shrink-0', iconColor)}>
        <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1 truncate group-data-[collapsed=true]/sidebar:hidden">
        {item.label}
      </span>
      {item.badge && (
        <span className="rounded-full bg-brand-soft-2 px-[7px] py-px font-mono text-[9px] font-semibold tracking-[0.04em] text-brand-active group-data-[collapsed=true]/sidebar:hidden">
          {item.badge}
        </span>
      )}
    </button>
  )
}
