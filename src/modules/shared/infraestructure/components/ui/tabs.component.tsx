import { type JSX } from 'react'
import { TabButton } from './tab-button.component'
import type { TabItem } from './tabs.model'

interface Props<T extends string> {
  value: T
  items: TabItem<T>[]
  onChange: (value: T) => void
}

export function Tabs<T extends string>({ value, items, onChange }: Props<T>): JSX.Element {
  return (
    <div className="flex gap-0.5 border-b border-hairline">
      {items.map((item) => (
        <TabButton key={item.value} item={item} active={item.value === value} onSelect={onChange} />
      ))}
    </div>
  )
}
