import { type JSX, useMemo } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { FilterStateOptionItem } from './filter-state-option.model'

interface Props<TValue extends string> {
  option: FilterStateOptionItem<TValue>
  selected: boolean
  onSelect: (option: FilterStateOptionItem<TValue>) => void
}

export function FilterStateOption<TValue extends string>({
  option,
  selected,
  onSelect,
}: Props<TValue>): JSX.Element {
  const rowClassName = useMemo(
    () =>
      cn(
        'flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-cream',
        selected ? 'font-semibold text-ink' : 'text-ink-2',
      ),
    [selected],
  )

  return (
    <button type="button" className={rowClassName} onClick={() => onSelect(option)}>
      <span>{option.label}</span>
      {selected && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} />}
    </button>
  )
}
