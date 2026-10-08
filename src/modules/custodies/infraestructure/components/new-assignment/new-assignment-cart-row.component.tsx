import { type JSX, useCallback } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { IconButton } from '../../../../shared/infraestructure/components/ui'
import type { NewAssignmentCartItem } from '../../../application/new-assignment-state.model'
import { NewAssignmentOptionHelper } from '../../helpers/new-assignment-option.helper'

interface Props {
  item: NewAssignmentCartItem
  onRemove: (stockId: string) => void
}

export function NewAssignmentCartRow({ item, onRemove }: Props): JSX.Element {
  const handleRemove = useCallback(() => onRemove(item.stock.id), [onRemove, item.stock.id])

  return (
    <li className="flex items-center gap-2 border-b border-hairline px-3 py-2.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="m-0 font-mono text-[12px] font-semibold text-ink">{item.stock.consecutive}</p>
        <p className="m-0 truncate text-[12px] text-ink-2">{item.stock.product.name}</p>
        <p className="m-0 truncate text-[11px] text-muted">
          {NewAssignmentOptionHelper.stockProductDetails(item.stock.product)}
        </p>
      </div>
      <IconButton
        icon={Delete02Icon}
        size="sm"
        danger
        title={`Quitar ${item.stock.consecutive}`}
        aria-label={`Quitar ${item.stock.consecutive}`}
        onClick={handleRemove}
      />
    </li>
  )
}
