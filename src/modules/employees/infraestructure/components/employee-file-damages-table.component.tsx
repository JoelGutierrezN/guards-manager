import { type JSX } from 'react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { EmployeeFileDamage } from '../../domain/employee-file-damage.model'
import { EmployeeFileDamageRow } from './employee-file-damage-row.component'

interface Props {
  damages: EmployeeFileDamage[]
  onDownloadSheet: (damage: EmployeeFileDamage) => void
}

const HEADER_CELL_CLASS_NAME =
  'sticky top-0 z-[1] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-muted uppercase'

export function EmployeeFileDamagesTable({ damages, onDownloadSheet }: Props): JSX.Element {
  if (damages.length === 0) {
    return (
      <Empty
        icon={Alert02Icon}
        title="Sin reportes de daño"
        body="Este colaborador no tiene devoluciones con unidades en mal estado."
      />
    )
  }

  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr>
          <th className={HEADER_CELL_CLASS_NAME}>Fecha</th>
          <th className={HEADER_CELL_CLASS_NAME}>Devolución</th>
          <th className={HEADER_CELL_CLASS_NAME}>Herramienta</th>
          <th className={HEADER_CELL_CLASS_NAME}>Condición</th>
          <th className={HEADER_CELL_CLASS_NAME}>Notas</th>
          <th className={cn(HEADER_CELL_CLASS_NAME, 'w-20')} />
        </tr>
      </thead>
      <tbody>
        {damages.map((damage) => (
          <EmployeeFileDamageRow
            key={damage.id}
            damage={damage}
            onDownloadSheet={onDownloadSheet}
          />
        ))}
      </tbody>
    </table>
  )
}
