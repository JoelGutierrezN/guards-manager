import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import { ItemConditionHelper } from '../../../shared/domain/item-condition.helper'
import type { CustodyItem } from '../../domain/custody.entity'
import { CustodyPresenter } from '../../application/custody-presenter.helper'
import { CustodyDateHelper } from '../helpers/custody-date.helper'

interface Props {
  item: CustodyItem
}

export function CustodyItemRow({ item }: Props): JSX.Element {
  return (
    <tr className="transition-colors [&_td]:hover:bg-paper-tint">
      <td className="px-3 py-2.5 align-middle text-[13px] text-ink">
        {CustodyPresenter.itemProductLabel(item)}
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[12px] font-medium text-ink-2">
        {item.stock.consecutive}
      </td>
      <td className="px-3 py-2.5 align-middle">
        <Chip tone={ItemConditionHelper.tone(item.condition)} size="sm">
          {ItemConditionHelper.label(item.condition)}
        </Chip>
      </td>
      <td className="px-3 py-2.5 align-middle">
        {item.isReturned ? (
          <Chip tone="ok" size="sm">
            {CustodyDateHelper.date(item.returnedAt)}
          </Chip>
        ) : (
          <Chip size="sm">Pendiente</Chip>
        )}
      </td>
      <td className="px-3 py-2.5 align-middle text-[12px] text-muted">{item.notes ?? '—'}</td>
    </tr>
  )
}
