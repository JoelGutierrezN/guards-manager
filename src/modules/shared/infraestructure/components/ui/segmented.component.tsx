import { type JSX } from 'react'
import { cn } from '../../utils/cn'

interface SegmentedItem<T extends string> {
  label: string
  value: T
}

interface SegmentedProps<T extends string> {
  value: T
  items: SegmentedItem<T>[]
  onChange: (value: T) => void
}

/** Control segmentado tipo "pill group". */
export function Segmented<T extends string>({
  value,
  items,
  onChange,
}: SegmentedProps<T>): JSX.Element {
  return (
    <div className="inline-flex gap-0.5 rounded-[14px] bg-cream-2 p-0.5">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-[10px] px-2.5 py-1 text-[12px] font-medium transition-colors',
            value === item.value
              ? 'bg-white text-ink shadow-[0_1px_2px_rgba(14,15,60,0.04)]'
              : 'text-muted hover:text-ink-2',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
