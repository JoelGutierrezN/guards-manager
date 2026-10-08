import { type JSX, type MouseEvent, useCallback } from 'react'
import { SignatureIcon } from '@hugeicons/core-free-icons'
import { Button } from '../../../shared/infraestructure/components/ui'
import type { Custody } from '../../domain/custody.entity'
import { CustodySignatureChip } from './custody-signature-chip.component'

interface Props {
  custody: Custody
  onSign: (custodyId: string) => void
}

/** La fila abre el detalle al pulsarla: el atajo a firmar no debe propagar ese clic. */
export function CustodySignatureCell({ custody, onSign }: Props): JSX.Element {
  const handleSign = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation()
      onSign(custody.id)
    },
    [onSign, custody.id],
  )

  const canSign = custody.signedAt == null && custody.status !== 'CANCELADO'

  return (
    <div className="flex items-center gap-2">
      <CustodySignatureChip signedAt={custody.signedAt} />
      {canSign && (
        <Button
          variant="ghost"
          size="sm"
          icon={SignatureIcon}
          aria-label={`Firmar el resguardo ${custody.code}`}
          onClick={handleSign}
        >
          Firmar
        </Button>
      )}
    </div>
  )
}
