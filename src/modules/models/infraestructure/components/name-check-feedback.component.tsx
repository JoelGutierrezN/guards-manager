import { type JSX } from 'react'
import { Checkbox } from '../../../shared/infraestructure/components/ui'
import type { NameCheckMatch } from '../../domain/product-model-name-check.model'
import type { NameCheckStatus } from '../../application/new-model-form.model'
import { NameCheckMatchRow } from './name-check-match.component'

interface Props {
  status: NameCheckStatus
  name: string
  duplicateModel: NameCheckMatch | null
  similarModels: NameCheckMatch[]
  similarConfirmed: boolean
  onSimilarConfirmedChange: (confirmed: boolean) => void
}

export function NameCheckFeedback({
  status,
  name,
  duplicateModel,
  similarModels,
  similarConfirmed,
  onSimilarConfirmedChange,
}: Props): JSX.Element | null {
  if (status === 'idle') return null

  if (status === 'checking') {
    return <span className="text-[12px] text-muted">Validando nombre…</span>
  }

  if (status === 'error') {
    return (
      <span className="text-[12px] text-warn">
        No se pudo validar el nombre. Se verificará al guardar.
      </span>
    )
  }

  if (status === 'duplicate' && duplicateModel != null) {
    return (
      <div className="flex flex-col gap-1.5 rounded-[12px] border border-danger-soft bg-danger-soft px-3 py-2.5">
        <span className="text-[12px] font-medium text-danger">
          Este modelo ya existe en la marca; no se puede duplicar.
        </span>
        <NameCheckMatchRow match={duplicateModel} />
      </div>
    )
  }

  if (status === 'similar' && similarModels.length > 0) {
    return (
      <div className="flex flex-col gap-2 rounded-[12px] border border-warn-soft bg-warn-soft px-3 py-2.5">
        <span className="text-[12px] font-medium text-warn">
          Ya existen modelos con un nombre muy parecido en esta marca. Verifica que «{name}» no sea
          un error de escritura:
        </span>
        <div className="flex flex-col gap-1">
          {similarModels.map((match) => (
            <NameCheckMatchRow key={match.id} match={match} />
          ))}
        </div>
        <Checkbox
          label="Confirmo que es un modelo diferente"
          checked={similarConfirmed}
          onChange={(event) => onSimilarConfirmedChange(event.target.checked)}
        />
      </div>
    )
  }

  if (status === 'free') {
    return <span className="text-[12px] text-ok">Nombre disponible en esta marca.</span>
  }

  return null
}
