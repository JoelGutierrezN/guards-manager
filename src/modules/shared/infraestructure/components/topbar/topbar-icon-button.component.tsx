import { type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

interface TopbarIconButtonProps {
  icon: IconSvgElement
  tip: string
  active?: boolean
  badge?: number
  onClick?: () => void
}

export function TopbarIconButton({
  icon,
  tip,
  active = false,
  badge,
  onClick,
}: TopbarIconButtonProps): JSX.Element {
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        data-active={active}
        aria-label={tip}
        className="group/tip relative inline-flex h-8 w-8 items-center justify-center rounded-[14px] border border-transparent text-ink-2 transition-colors hover:bg-brand-soft hover:text-ink data-[active=true]:bg-brand-soft-2 data-[active=true]:text-brand-active"
      >
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} />
        <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-0.5 -translate-x-1/2 translate-y-0 rounded-[10px] bg-ink px-2 py-1 text-[11px] font-medium whitespace-nowrap text-cream opacity-0 transition-all duration-150 group-hover/tip:translate-y-0.5 group-hover/tip:opacity-100">
          {tip}
        </span>
      </button>
      {badge != null && (
        <span className="pointer-events-none absolute -top-[3px] -right-[3px] z-10 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border-[1.5px] border-white bg-brand px-[3px] font-mono text-[9px] font-semibold text-white">
          {badge}
        </span>
      )}
    </div>
  )
}
