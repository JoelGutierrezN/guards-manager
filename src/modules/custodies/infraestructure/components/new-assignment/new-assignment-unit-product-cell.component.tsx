import { type JSX } from 'react'
import type { AssignmentStockProduct } from '../../../domain/new-assignment-option.model'
import { NewAssignmentOptionHelper } from '../../helpers/new-assignment-option.helper'

interface Props {
  product: AssignmentStockProduct
}

export function NewAssignmentUnitProductCell({ product }: Props): JSX.Element {
  return (
    <div className="min-w-0">
      <p className="m-0 truncate text-[13px] font-medium text-ink">{product.name}</p>
      <p className="m-0 truncate text-[11px] text-muted">
        {NewAssignmentOptionHelper.stockProductDetails(product)}
      </p>
    </div>
  )
}
