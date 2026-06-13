import { type JSX, useMemo } from 'react'
import { Edit02Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import { IconButton } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { Tool } from '../../domain/tool.entity'
import { ToolStatusHelper } from '../../application/tool-status.helper'
import { InventoryService } from '../../application/inventory.service'

interface Props {
  tool: Tool
}

export function ToolRow({ tool }: Props): JSX.Element {
  const usagePercent = useMemo(() => InventoryService.usagePercent(tool), [tool])
  const barColorClass = useMemo(() => ToolStatusHelper.barColorClass(tool.status), [tool.status])

  const handleEdit = () => {
    // TODO API: abrir el flujo de edición de la herramienta (PUT /api/tools/{id}).
  }

  const handleDelete = () => {
    // TODO API: dar de baja / eliminar la herramienta (DELETE /api/tools/{id}) con confirmación.
  }

  return (
    <tr className="group transition-colors [&_td]:hover:bg-paper-tint">
      <td className="min-w-[200px] px-3 py-2.5 align-middle text-[13px] font-medium text-ink">
        {tool.name}
      </td>
      <td className="w-[120px] px-3 py-2.5 align-middle text-[13px] text-ink-2">{tool.brand}</td>
      <td className="w-[140px] px-3 py-2.5 align-middle font-mono text-[13px] text-ink-2">
        {tool.model}
      </td>
      <td className="w-[190px] px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2">
          <span className="w-14 font-mono text-[13px] font-medium tabular-nums">
            <span className="text-ink">{tool.available}</span>
            <span className="text-muted"> / {tool.total}</span>
          </span>
          <div className="h-1 max-w-[90px] flex-1 overflow-hidden rounded-full bg-cream-2">
            <div
              className={cn('h-full rounded-full transition-[width]', barColorClass)}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </td>
      <td className="w-[80px] px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
        {tool.assigned}
      </td>
      <td className="w-[90px] px-3 py-2.5 align-middle text-right">
        {/* TODO API: editar/eliminar la herramienta (PUT/DELETE /api/tools/{id}). */}
        <div className="row-actions flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton icon={Edit02Icon} tip="Editar" size="sm" onClick={handleEdit} />
          <IconButton icon={Delete02Icon} tip="Eliminar" size="sm" danger onClick={handleDelete} />
        </div>
      </td>
    </tr>
  )
}
