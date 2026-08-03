import { type JSX } from 'react'
import { Checkbox } from '../../../shared/infraestructure/components/ui'

interface Props {
  filterKey: string
  label: string
  count: number
  checked: boolean
  onToggle: (key: string) => void
}

export function ToolFilterCheckItem({
  filterKey,
  label,
  count,
  checked,
  onToggle,
}: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between py-0.5">
      <Checkbox checked={checked} onChange={() => onToggle(filterKey)} label={label} />
      <span className="font-mono text-[11px] text-muted">{count}</span>
    </div>
  )
}
