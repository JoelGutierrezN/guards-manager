import { type JSX, useMemo } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { ModelStateOption } from '../../domain/models-filters.model'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  option: ModelStateOption
  selected: boolean
  onSelect: (option: ModelStateOption) => void
}

export function FilterStateOption({ option, selected, onSelect }: Props): JSX.Element {
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
