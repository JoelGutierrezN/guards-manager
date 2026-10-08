import { type JSX, useMemo } from 'react'
import { ShoppingBasket01Icon } from '@hugeicons/core-free-icons'
import { Button, Icon } from '../../../../shared/infraestructure/components/ui'
import type { NewAssignmentCartItem } from '../../../application/new-assignment-state.model'
import { NewAssignmentCartRow } from './new-assignment-cart-row.component'

interface Props {
  items: NewAssignmentCartItem[]
  onRemove: (stockId: string) => void
  onClear: () => void
}

export function NewAssignmentCart({ items, onRemove, onClear }: Props): JSX.Element {
  const countLabel = useMemo(
    () =>
      items.length === 1 ? '1 unidad en el carrito' : `${items.length} unidades en el carrito`,
    [items.length],
  )

  return (
    <aside className="flex flex-col overflow-hidden rounded-[18px] border border-hairline bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-hairline px-3 py-2.5">
        <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink">
          <Icon icon={ShoppingBasket01Icon} size={15} />
          {countLabel}
        </span>
        {items.length > 0 && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            Vaciar
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <p className="m-0 px-3 py-6 text-center text-[12px] text-muted">
          Selecciona unidades disponibles y agrégalas al resguardo.
        </p>
      ) : (
        <ul className="m-0 max-h-105 list-none overflow-y-auto p-0">
          {items.map((item) => (
            <NewAssignmentCartRow key={item.stock.id} item={item} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </aside>
  )
}
