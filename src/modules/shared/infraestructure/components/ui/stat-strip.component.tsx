import { type JSX } from 'react'
import type { StatStripEntry } from './stat-strip.model'
import { StatStripItem } from './stat-strip-item.component'

interface Props {
  items: StatStripEntry[]
}

export function StatStrip({ items }: Props): JSX.Element {
  return (
    <div className="mb-4 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
      {items.map((entry) => (
        <StatStripItem key={entry.label} entry={entry} />
      ))}
    </div>
  )
}
