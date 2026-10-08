import { type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

interface Props {
  label: string
  icon?: IconSvgElement
  onSelect: () => void
}

export function CommandPaletteItem({ label, icon, onSelect }: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-left text-[13px] text-ink transition-colors hover:bg-brand-soft"
    >
      {icon && (
        <HugeiconsIcon icon={icon} size={15} strokeWidth={1.8} className="shrink-0 text-ink-2" />
      )}
      <span className="truncate">{label}</span>
    </button>
  )
}
