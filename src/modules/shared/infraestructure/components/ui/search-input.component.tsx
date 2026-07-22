import { type JSX, useMemo } from 'react'
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  leadIcon?: IconSvgElement
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar…',
  leadIcon = Search01Icon,
  ariaLabel = 'Buscar',
  disabled = false,
  className,
}: Props): JSX.Element {
  const wrapClassName = useMemo(
    () =>
      cn(
        'flex h-9 max-w-65 items-center gap-2 rounded-full border border-hairline-strong bg-white px-3 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3',
        disabled && 'cursor-not-allowed bg-cream hover:border-hairline-strong',
        className,
      ),
    [disabled, className],
  )

  const clearVisible = value !== '' && !disabled

  const clearClassName = useMemo(
    () =>
      cn(
        'inline-flex shrink-0 items-center justify-center rounded-full p-0.5 text-muted transition-opacity',
        clearVisible
          ? 'cursor-pointer opacity-100 hover:bg-cream hover:text-ink'
          : 'pointer-events-none opacity-0',
      ),
    [clearVisible],
  )

  return (
    <div className={wrapClassName}>
      <HugeiconsIcon icon={leadIcon} size={14} strokeWidth={1.8} className="shrink-0 text-muted" />
      <input
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-muted-soft disabled:cursor-not-allowed"
      />
      <button
        type="button"
        aria-label="Limpiar búsqueda"
        aria-hidden={!clearVisible}
        tabIndex={clearVisible ? 0 : -1}
        onClick={() => onChange('')}
        className={clearClassName}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2} />
      </button>
    </div>
  )
}
