import { type JSX } from 'react'
import { Chip } from '../../../../shared/infraestructure/components/ui'
import { ItemConditionHelper } from '../../../../shared/domain/item-condition.helper'
import type { SignDocumentItem } from '../../../domain/sign-document.model'

interface Props {
  item: SignDocumentItem
}

export function SignDocumentItemRow({ item }: Props): JSX.Element {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-hairline py-2 last:border-b-0">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[12px] text-ink">{item.productLabel}</span>
        <span className="font-mono text-[11px] text-muted">{item.consecutive}</span>
      </div>
      <Chip tone={ItemConditionHelper.tone(item.condition)} size="sm">
        {ItemConditionHelper.label(item.condition)}
      </Chip>
    </li>
  )
}
