import { type JSX } from 'react'
import { CustodyPresenter } from '../../../application/custody-presenter.helper'
import type { CustodyItem } from '../../../domain/custody.entity'

interface Props {
  item: CustodyItem
  errorMessage?: string
}

export function ReturnItemProductCell({ item, errorMessage }: Props): JSX.Element {
  return (
    <div className="min-w-0">
      <p className="m-0 font-mono text-[12px] font-semibold text-ink">{item.stock.consecutive}</p>
      <p className="m-0 truncate text-[13px] text-ink-2">
        {CustodyPresenter.itemProductLabel(item)}
      </p>
      {errorMessage && (
        <p className="m-0 mt-1 text-[11px] font-semibold text-danger" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
