import { type JSX, memo, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { SegmentedItem } from './segmented.model'

interface SegmentedButtonProps<T extends string> {
  item: SegmentedItem<T>
  active: boolean
  onSelect: (value: T) => void
}

function SegmentedButtonInner<T extends string>({
  item,
  active,
  onSelect,
}: SegmentedButtonProps<T>): JSX.Element {
  const buttonClassName = useMemo(
    () =>
      cn(
        'inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1 text-[12px] font-medium transition-colors',
        active
          ? 'bg-white text-ink shadow-[0_1px_2px_rgba(14,15,60,0.04)]'
          : 'text-muted hover:text-ink-2',
      ),
    [active],
  )

  return (
    <button type="button" onClick={() => onSelect(item.value)} className={buttonClassName}>
      {item.icon && <HugeiconsIcon icon={item.icon} size={12} strokeWidth={1.8} />}
      {item.label}
    </button>
  )
}

export const SegmentedButton = memo(SegmentedButtonInner) as typeof SegmentedButtonInner
