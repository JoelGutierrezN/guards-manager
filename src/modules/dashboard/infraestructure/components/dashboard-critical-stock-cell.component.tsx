import { type JSX } from 'react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import type { DashboardCriticalStockItem } from '../../domain/dashboard-critical-stock-item.model'
import { DashboardCell } from './dashboard-cell.component'
import { DashboardCellTitle } from './dashboard-cell-title.component'
import { DashboardCriticalStockRow } from './dashboard-critical-stock-row.component'
import { DashboardEyebrow } from './dashboard-eyebrow.component'

interface Props {
  items: DashboardCriticalStockItem[]
  onOpenProduct: (item: DashboardCriticalStockItem) => void
}

export function DashboardCriticalStockCell({ items, onOpenProduct }: Props): JSX.Element {
  return (
    <DashboardCell variant="cream" span={3} label="Stock crítico">
      <div>
        <DashboardEyebrow>Inventario</DashboardEyebrow>
        <DashboardCellTitle>Stock crítico</DashboardCellTitle>
      </div>

      {items.length === 0 ? (
        <Empty
          icon={Alert02Icon}
          title="Sin productos en riesgo"
          body="Ningún producto está por debajo de su umbral de disponibles."
        />
      ) : (
        <div>
          {items.map((item) => (
            <DashboardCriticalStockRow key={item.productId} item={item} onOpen={onOpenProduct} />
          ))}
        </div>
      )}
    </DashboardCell>
  )
}
