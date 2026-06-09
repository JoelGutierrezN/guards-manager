import { type JSX } from 'react'
import type { TabItem } from './tabs.model'
import { TabButton } from './tab-button.component'

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  items: TabItem<T>[]
}

export function Tabs<T extends string>({ value, onChange, items }: TabsProps<T>): JSX.Element {
  return (
    <div className="flex gap-0.5 border-b border-hairline">
      {items.map((item) => (
        <TabButton
          key={item.value}
          item={item}
          active={value === item.value}
          onSelect={onChange}
        />
      ))}
    </div>
  )
}
