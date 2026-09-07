import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import type { ProductOption } from '../../domain/product-option.model'

interface Props {
  product: ProductOption
}

const UNKNOWN_VALUE = 'Sin dato'

export function StockInProductCard({ product }: Props): JSX.Element {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[14px] border border-hairline bg-cream px-3 py-2.5">
      <span className="text-[13px] font-semibold text-ink">{product.name}</span>
      <Chip tone="default" size="sm">
        {product.brandName ?? UNKNOWN_VALUE}
      </Chip>
      <Chip tone="default" size="sm">
        {product.modelName ?? UNKNOWN_VALUE}
      </Chip>
      {product.available !== null && (
        <Chip tone="navy" size="sm">
          {product.available} disponibles
        </Chip>
      )}
      {product.total !== null && (
        <span className="font-mono text-[11px] text-muted">{product.total} en total</span>
      )}
    </div>
  )
}
