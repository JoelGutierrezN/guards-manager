import { type JSX } from 'react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface TopbarSearchProps {
  onClick?: () => void
  placeholder?: string
}

export function TopbarSearch({
  onClick,
  placeholder = 'Buscar herramientas, empleados, asignaciones…',
}: TopbarSearchProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 min-w-[360px] cursor-text items-center gap-2 rounded-full border border-lavender-line bg-white/70 pr-3 pl-4 text-[12px] text-muted backdrop-blur-[10px] transition-[border-color,background,box-shadow] hover:border-brand-mid hover:bg-white hover:shadow-[0_0_0_4px_var(--color-brand-soft)]"
    >
      <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.8} />
      <span className="flex-1 text-left">{placeholder}</span>
      <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-lavender-bg px-2 font-mono text-[10px] font-semibold tracking-[0.04em] text-ink-2">
        ⌘ K
      </span>
    </button>
  )
}
