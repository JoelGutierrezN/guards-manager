import { type JSX, useMemo } from 'react'
import {
  Delete02Icon,
  PencilEdit02Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons'
import { Checkbox, IconButton } from '../../../shared/infraestructure/components/ui'
import type { ProductModel } from '../../domain/product-model.entity'
import { MODELS_TABLE_TD } from './models-table.model'

interface Props {
  model: ProductModel
  pending: boolean
  onEdit: () => void
  onDeactivate: () => void
  onReactivate: () => void
  onDelete: () => void
}

const DISABLED_ACTION = 'pointer-events-none opacity-35'

export function ModelRow({
  model,
  pending,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
}: Props): JSX.Element {
  const { brandName, name, stocksTotal, stocksAssigned, usagePercentage, active, discontinuationReason } =
    model

  const rowClassName = useMemo(
    () =>
      active
        ? 'group/row transition-colors hover:bg-[#fbf9fc]'
        : 'group/row bg-cream/60 transition-colors',
    [active],
  )

  const textClassName = useMemo(() => (active ? 'text-ink' : 'text-muted'), [active])

  const editClassName = useMemo(
    () => (!active || pending ? DISABLED_ACTION : undefined),
    [active, pending],
  )

  const pendingClassName = useMemo(() => (pending ? DISABLED_ACTION : undefined), [pending])

  const canDelete = stocksAssigned === 0

  const deleteClassName = useMemo(
    () => (!canDelete || pending ? DISABLED_ACTION : undefined),
    [canDelete, pending],
  )

  const deleteTip = canDelete
    ? 'Eliminar'
    : 'Recolecta las herramientas en resguardo para poder eliminar'

  const usageBarWidth = useMemo(
    () => `${Math.min(100, Math.max(0, usagePercentage))}%`,
    [usagePercentage],
  )

  return (
    <tr className={rowClassName}>
      <td className={`${MODELS_TABLE_TD} w-8`}>
        <span title="Selección múltiple en desarrollo">
          <Checkbox disabled />
        </span>
      </td>
      <td className={`${MODELS_TABLE_TD} w-32.5`}>
        <span className={`font-medium ${textClassName}`}>{brandName}</span>
      </td>
      <td className={`${MODELS_TABLE_TD} w-42.5 min-w-50`}>
        <div className="flex items-center gap-2">
          <span className={`font-mono font-medium ${textClassName}`}>{name}</span>
          {!active && (
              discontinuationReason != null && (
                <span className="max-w-55 truncate text-zinc-600 capitalize italic text-xs">
                  {discontinuationReason}
                </span>
              )
          )}
        </div>
      </td>
      <td className={`${MODELS_TABLE_TD} w-20 font-mono font-medium text-ink-2`}>{stocksTotal}</td>
      <td className={`${MODELS_TABLE_TD} w-42.5`}>
        <div className="flex items-center gap-2">
          <span className="w-9 font-mono text-[11px] text-ink-2">
            {stocksAssigned}/{stocksTotal}
          </span>
          <div className="h-1 max-w-20 flex-1 overflow-hidden rounded-sm bg-cream-2">
            <div className="h-full bg-brand" style={{ width: usageBarWidth }} />
          </div>
          <span className="w-8 text-right font-mono text-[11px] text-muted">{usagePercentage}%</span>
        </div>
      </td>
      <td className={`${MODELS_TABLE_TD} w-37.5 text-right`}>
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
          <IconButton
            icon={PencilEdit02Icon}
            tip="Editar"
            size="sm"
            disabled={!active || pending}
            className={editClassName}
            onClick={onEdit}
          />
          {active ? (
            <IconButton
              icon={ThumbsDownIcon}
              tip="Dar de baja"
              size="sm"
              disabled={pending}
              className={pendingClassName}
              onClick={onDeactivate}
            />
          ) : (
            <IconButton
              icon={ThumbsUpIcon}
              tip="Reactivar"
              size="sm"
              disabled={pending}
              className={pendingClassName}
              onClick={onReactivate}
            />
          )}
          {!active && (
            <IconButton
              icon={Delete02Icon}
              tip={deleteTip}
              size="sm"
              danger
              disabled={!canDelete || pending}
              className={deleteClassName}
              onClick={onDelete}
            />
          )}
        </div>
      </td>
    </tr>
  )
}
