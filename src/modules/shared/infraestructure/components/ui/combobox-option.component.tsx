import { type JSX, useMemo } from 'react'
import { Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { ComboboxItem } from './combobox.model'

interface Props {
  item: ComboboxItem
  optionId: string
  isSelected: boolean
  isHighlighted: boolean
  onSelect: (value: string) => void
  onHighlight: () => void
}

export function ComboboxOption({
  item,
  optionId,
  isSelected,
  isHighlighted,
  onSelect,
  onHighlight,
}: Props): JSX.Element {
  const optionClassName = useMemo(
    () =>
      cn(
        'flex w-full items-center justify-between gap-3 rounded-[10px] px-2.5 py-2 text-left text-[13px] transition-colors',
        item.disabled && 'cursor-not-allowed opacity-50',
        !item.disabled && 'cursor-pointer',
        isSelected && 'bg-brand-soft font-semibold text-brand',
        !isSelected && isHighlighted && 'bg-paper-tint text-ink',
        !isSelected && !isHighlighted && 'font-medium text-ink-2',
      ),
    [item.disabled, isSelected, isHighlighted],
  )

  return (
    <button
      type="button"
      id={optionId}
      role="option"
      aria-selected={isSelected}
      disabled={item.disabled}
      className={optionClassName}
      onMouseEnter={onHighlight}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onSelect(item.value)}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate">{item.label}</span>
        {item.description && (
          <span className="block truncate text-[11px] font-normal text-muted">
            {item.description}
          </span>
        )}
      </span>
      {isSelected && <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={1.8} />}
    </button>
  )
}
