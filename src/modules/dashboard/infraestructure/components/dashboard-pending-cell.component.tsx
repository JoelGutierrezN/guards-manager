import { type JSX } from 'react'
import { SignatureIcon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import type { DashboardPendingSignature } from '../../domain/dashboard-pending-signature.model'
import { DashboardCell } from './dashboard-cell.component'
import { DashboardCellTitle } from './dashboard-cell-title.component'
import { DashboardEyebrow } from './dashboard-eyebrow.component'
import { DashboardPendingRow } from './dashboard-pending-row.component'

interface Props {
  signatures: DashboardPendingSignature[]
  onSign: (signature: DashboardPendingSignature) => void
}

export function DashboardPendingCell({ signatures, onSign }: Props): JSX.Element {
  return (
    <DashboardCell span={3} label="Pendientes de firma">
      <div>
        <DashboardEyebrow>Firmas</DashboardEyebrow>
        <DashboardCellTitle>Pendientes de firma</DashboardCellTitle>
      </div>

      {signatures.length === 0 ? (
        <Empty
          icon={SignatureIcon}
          title="Todo está firmado"
          body="No hay resguardos ni devoluciones esperando firma."
        />
      ) : (
        <div>
          {signatures.map((signature) => (
            <DashboardPendingRow
              key={`${signature.type}-${signature.id}`}
              signature={signature}
              onSign={onSign}
            />
          ))}
        </div>
      )}
    </DashboardCell>
  )
}
