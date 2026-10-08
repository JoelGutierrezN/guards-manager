import { type JSX } from 'react'
import type { Tool } from '../../domain/tool.entity'

interface Props {
  tool: Tool
  conflict: string | null
}

export function ToolDeleteBody({ tool, conflict }: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      <p>
        Vas a eliminar <b className="text-ink">{tool.name}</b>{' '}
        <span className="font-mono text-[11px] text-muted">
          ({tool.brand} · {tool.model})
        </span>{' '}
        del catálogo junto con sus {tool.total} unidades. Esta acción no se puede deshacer.
      </p>

      {tool.assigned > 0 && (
        <p className="text-warn">
          {tool.assigned} unidades siguen asignadas en resguardos activos: devuélvelas antes de
          eliminar la herramienta.
        </p>
      )}

      {conflict !== null && (
        <p className="text-danger" role="alert">
          {conflict}
        </p>
      )}
    </div>
  )
}
