import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import type { NameCheckMatch } from '../../domain/product-model-name-check.model'

interface Props {
  match: NameCheckMatch
}

export function NameCheckMatchRow({ match }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[13px] font-semibold text-ink">{match.name}</span>
      {!match.active && (
        <Chip tone="warn" size="sm">
          Dado de baja
        </Chip>
      )}
    </div>
  )
}
