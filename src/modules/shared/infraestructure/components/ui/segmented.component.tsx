import { type JSX } from 'react'
import type { SegmentedItem } from './segmented.model'
import { SegmentedButton } from './segmented-button.component'

interface SegmentedProps<T extends string> {
  value: T
  items: SegmentedItem<T>[]
  onChange: (value: T) => void
}

export function Segmented<T extends string>({
  value,
  items,
  onChange,
}: SegmentedProps<T>): JSX.Element {
  return (
    <div className="inline-flex gap-0.5 rounded-[14px] bg-cream-2 p-0.5">
      {items.map((item) => (
        <SegmentedButton
          key={item.value}
          item={item}
          active={value === item.value}
          onSelect={onChange}
        />
      ))}
    </div>
  )
}
