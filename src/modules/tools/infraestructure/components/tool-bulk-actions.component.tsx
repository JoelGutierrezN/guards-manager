import { type JSX } from 'react'
import { SentIcon, RefreshIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import { Button } from '../../../shared/infraestructure/components/ui'

interface Props {
  selectedCount: number
}

export function ToolBulkActions({ selectedCount }: Props): JSX.Element {
  // TODO API: acciones masivas sobre la selección:
  //   · "Asignar a…"     → POST /api/assignments (asignar las herramientas seleccionadas)
  //   · "Mover a mantto" → PATCH /api/tools (status = 'mantto')
  //   · eliminar         → DELETE /api/tools (ids seleccionados)
  return (
    <>
      <span className="text-[13px] text-muted">
        {selectedCount} seleccionada{selectedCount > 1 ? 's' : ''}
      </span>
      <Button size="sm" icon={SentIcon}>Asignar a…</Button>
      <Button size="sm" icon={RefreshIcon}>Mover a mantto</Button>
      <Button size="sm" variant="danger" icon={Delete02Icon} aria-label="Eliminar selección" />
    </>
  )
}
