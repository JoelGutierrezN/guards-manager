import { type JSX, useMemo } from 'react'
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Edit02Icon,
  Delete02Icon,
} from '@hugeicons/core-free-icons'
import { Button, IconButton, Icon } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { Tool } from '../../domain/tool.entity'
import { ToolStatusHelper } from '../../application/tool-status.helper'
import { ToolsService } from '../../application/tools.service'

interface Props {
  tool: Tool
  onStock: () => void
  onIngreso: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ToolRow({ tool, onStock, onIngreso, onEdit, onDelete }: Props): JSX.Element {
  const usagePercent = useMemo(() => ToolsService.usagePercent(tool), [tool])
  const barColorClass = useMemo(() => ToolStatusHelper.barColorClass(tool.status), [tool.status])

  const available = tool.total - tool.assigned
  const hasStock = available > 0
  const deleteTip = hasStock ? `No se puede eliminar · ${available} en stock` : 'Eliminar'

  return (
    <tr className="group transition-colors [&_td]:hover:bg-paper-tint">
      <td className="min-w-[200px] px-3 py-2.5 align-middle text-[13px] font-medium text-ink">
        {tool.name}
      </td>
      <td className="w-[110px] px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {tool.brand}
      </td>
      <td className="w-[140px] px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {tool.model}
      </td>
      <td className="w-[190px] px-3 py-2.5 align-middle">
        <button
          type="button"
          onClick={onStock}
          title="Ver existencias en detalle"
          className="group/stock -mx-1.5 -my-1 flex w-full items-center gap-2 rounded-[8px] border border-transparent px-1.5 py-1 text-left transition-colors hover:border-brand-soft-2 hover:bg-brand-soft"
        >
          <span className="w-14 shrink-0 font-mono text-[13px] font-medium tabular-nums">
            <span className="text-ink">{available}</span>
            <span className="text-muted"> / {tool.total}</span>
          </span>
          <span className="h-1 max-w-[90px] flex-1 overflow-hidden rounded-full bg-cream-2">
            <span
              className={cn('block h-full rounded-full', barColorClass)}
              style={{ width: `${usagePercent}%` }}
            />
          </span>
          <Icon
            icon={ArrowRight01Icon}
            size={12}
            className="ml-auto shrink-0 text-muted-soft opacity-0 transition-opacity group-hover/stock:opacity-100"
          />
        </button>
      </td>
      <td className="w-[70px] px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
        {tool.assigned}
      </td>
      <td className="w-[160px] px-3 py-2.5 align-middle text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="inline-flex opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="sm" icon={ArrowDown01Icon} onClick={onIngreso}>
              Declarar ingreso
            </Button>
          </span>
          <IconButton icon={Edit02Icon} tip="Editar" size="sm" onClick={onEdit} />
          <IconButton
            icon={Delete02Icon}
            tip={deleteTip}
            size="sm"
            danger={!hasStock}
            disabled={hasStock}
            onClick={hasStock ? undefined : onDelete}
          />
        </div>
      </td>
    </tr>
  )
}
