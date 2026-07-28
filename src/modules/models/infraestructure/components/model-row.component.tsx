import { type JSX, useMemo } from 'react'
import { Delete02Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { Checkbox, IconButton } from '../../../shared/infraestructure/components/ui'
import type { ProductModel } from '../../domain/product-model.entity'
import { MODELS_TABLE_TD } from './models-table.model'

interface Props {
  model: ProductModel
  onEdit: () => void
  onDelete: () => void
}

export function ModelRow({ model, onEdit, onDelete }: Props): JSX.Element {
  const { brandName, name, stocksTotal, stocksAssigned, usagePercentage } = model

  const usageBarWidth = useMemo(
    () => `${Math.min(100, Math.max(0, usagePercentage))}%`,
    [usagePercentage],
  )

  return (
    <tr className="group/row transition-colors hover:bg-[#fbf9fc]">
      <td className={`${MODELS_TABLE_TD} w-8`}>
        <Checkbox />
      </td>
      <td className={`${MODELS_TABLE_TD} w-[130px]`}>
        <span className="font-medium text-ink">{brandName}</span>
      </td>
      <td className={`${MODELS_TABLE_TD} w-[170px] min-w-[200px] font-mono font-medium text-ink`}>
        {name}
      </td>
      <td className={`${MODELS_TABLE_TD} w-20 font-mono font-medium text-ink-2`}>{stocksTotal}</td>
      <td className={`${MODELS_TABLE_TD} w-[170px]`}>
        <div className="flex items-center gap-2">
          <span className="w-9 font-mono text-[11px] text-ink-2">
            {stocksAssigned}/{stocksTotal}
          </span>
          <div className="h-1 max-w-20 flex-1 overflow-hidden rounded-[2px] bg-cream-2">
            <div className="h-full bg-brand" style={{ width: usageBarWidth }} />
          </div>
          <span className="w-8 text-right font-mono text-[11px] text-muted">{usagePercentage}%</span>
        </div>
      </td>
      <td className={`${MODELS_TABLE_TD} w-[150px] text-right`}>
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
          <IconButton icon={PencilEdit02Icon} tip="Editar" size="sm" onClick={onEdit} />
          <IconButton icon={Delete02Icon} tip="Eliminar" size="sm" danger onClick={onDelete} />
        </div>
      </td>
    </tr>
  )
}
