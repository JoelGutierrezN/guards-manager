import { type JSX, useMemo } from 'react'
import { ArrowDown01Icon, SentIcon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
import {
  Checkbox,
  Chip,
  Button,
  IconButton,
} from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { Tool } from '../../domain/tool.entity'
import { ToolStatusHelper } from '../../application/tool-status.helper'
import { InventoryService } from '../../application/inventory.service'

interface Props {
  tool: Tool
  selected: boolean
  onSelect: () => void
  onIngreso: () => void
}

export function ToolRow({ tool, selected, onSelect, onIngreso }: Props): JSX.Element {
  const usagePercent = useMemo(() => InventoryService.usagePercent(tool), [tool])
  const availableCount = useMemo(() => InventoryService.availableCount(tool), [tool])
  const barColorClass = useMemo(() => ToolStatusHelper.barColorClass(tool.status), [tool.status])
  const chipTone = useMemo(() => ToolStatusHelper.tone(tool.status), [tool.status])
  const chipLabel = useMemo(() => ToolStatusHelper.label(tool.status), [tool.status])

  const rowClassName = useMemo(
    () =>
      cn(
        'group transition-colors',
        selected ? '[&_td]:bg-brand-soft' : '[&_td]:hover:bg-paper-tint',
      ),
    [selected],
  )

  return (
    <tr className={rowClassName}>
      <td className="w-8 px-3 py-2.5 align-middle">
        <Checkbox checked={selected} onChange={onSelect} />
      </td>
      <td className="min-w-[220px] px-3 py-2.5 align-middle">
        <div className="text-[13px] font-medium text-ink">{tool.name}</div>
        <div className="font-mono text-[11px] text-muted">
          {tool.brand} · {tool.model}
        </div>
      </td>
      <td className="w-[110px] px-3 py-2.5 align-middle text-[13px] font-medium text-ink">
        {tool.brand}
      </td>
      <td className="w-[130px] px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink">
        {tool.model}
      </td>
      <td className="w-[180px] px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2">
          <span className="w-14 font-mono text-[13px] font-medium tabular-nums">
            <span className="text-ink">{availableCount}</span>
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
      <td className="w-[70px] px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
        {tool.assigned}
      </td>
      <td className="w-[140px] px-3 py-2.5 align-middle">
        <Chip tone={chipTone} size="sm" dot>
          {chipLabel}
        </Chip>
      </td>
      <td className="w-[150px] px-3 py-2.5 align-middle text-right">
        {/* TODO API: "Asignar" → POST /api/assignments para esta herramienta; "Más" abre editar/baja. */}
        <div className="row-actions flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="sm" icon={ArrowDown01Icon} onClick={onIngreso}>
            Declarar ingreso
          </Button>
          <IconButton icon={SentIcon} tip="Asignar" size="sm" />
          <IconButton icon={MoreHorizontalIcon} tip="Más" size="sm" />
        </div>
      </td>
    </tr>
  )
}
