import { type JSX } from 'react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface SidebarCollapseButtonProps {
  onToggle: () => void
}

export function SidebarCollapseButton({
  onToggle,
}: SidebarCollapseButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Colapsar menú"
      className="collapse-btn-shadow absolute right-[-10px] top-[22px] z-[11] flex h-[22px] w-[22px] items-center justify-center rounded-full border border-lavender-line bg-white text-ink-2 transition-colors hover:border-brand-mid hover:text-brand"
    >
      <span className="flex transition-transform duration-200 group-data-[collapsed=true]/sidebar:rotate-180">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={11} strokeWidth={2} />
      </span>
    </button>
  )
}
