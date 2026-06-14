import { type JSX } from 'react'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  color: string
  label: string
  count: number
}

export function ToolStockSectionTitle({ color, label, count }: Props): JSX.Element {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <span className={cn('font-mono text-[11px]', count ? 'text-muted' : 'text-muted-soft')}>
        {count}
      </span>
    </div>
  )
}
