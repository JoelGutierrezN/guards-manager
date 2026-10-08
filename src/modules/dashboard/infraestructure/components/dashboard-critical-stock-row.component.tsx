import { type JSX, useCallback } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import type { DashboardCriticalStockItem } from '../../domain/dashboard-critical-stock-item.model'

interface Props {
  item: DashboardCriticalStockItem
  onOpen: (item: DashboardCriticalStockItem) => void
}

export function DashboardCriticalStockRow({ item, onOpen }: Props): JSX.Element {
  const handleOpen = useCallback(() => onOpen(item), [onOpen, item])

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-hairline py-2.5 text-left transition-colors hover:bg-brand-soft"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">{item.name}</span>
        <span className="block font-mono text-[11px] text-muted">{item.brandName}</span>
      </span>
      <Chip tone={item.available === 0 ? 'danger' : 'warn'} size="sm">
        {item.available} / {item.threshold}
      </Chip>
    </button>
  )
}
