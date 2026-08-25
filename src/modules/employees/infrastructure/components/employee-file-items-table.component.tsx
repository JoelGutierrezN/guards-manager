import { type JSX } from 'react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { Checkbox, Empty } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { EmployeeFileItem } from '../../domain/employee-file-item.model'
import { EmployeeFileItemRow } from './employee-file-item-row.component'

interface Props {
  items: EmployeeFileItem[]
  selectedItemIds: Set<string>
  allSelected: boolean
  someSelected: boolean
  onToggleItem: (itemId: string) => void
  onToggleAll: () => void
}

const HEADER_CELL_CLASS_NAME =
  'sticky top-0 z-[1] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-muted uppercase'

export function EmployeeFileItemsTable({
  items,
  selectedItemIds,
  allSelected,
  someSelected,
  onToggleItem,
  onToggleAll,
}: Props): JSX.Element {
  if (items.length === 0) {
    return (
      <Empty
        icon={PackageIcon}
        title="Sin herramientas en resguardo"
        body="Este colaborador no tiene unidades asignadas actualmente."
      />
    )
  }

  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr>
          <th className={cn(HEADER_CELL_CLASS_NAME, 'w-8')}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={onToggleAll}
              aria-label="Seleccionar todas las unidades"
            />
          </th>
          <th className={HEADER_CELL_CLASS_NAME}>Herramienta</th>
          <th className={HEADER_CELL_CLASS_NAME}>Unidad</th>
          <th className={HEADER_CELL_CLASS_NAME}>Asignación</th>
          <th className={HEADER_CELL_CLASS_NAME}>Desde</th>
          <th className={HEADER_CELL_CLASS_NAME}>Estado</th>
          <th className={cn(HEADER_CELL_CLASS_NAME, 'w-20')} />
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <EmployeeFileItemRow
            key={item.id}
            item={item}
            selected={selectedItemIds.has(item.id)}
            onToggle={onToggleItem}
          />
        ))}
      </tbody>
    </table>
  )
}
