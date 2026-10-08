import { type JSX } from 'react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { BrandSelectOption } from '../../../brands/domain/brand-select.model'
import { BrandAvatar } from '../../../brands/infraestructure/components/brand-avatar.component'

interface Props {
  brand: BrandSelectOption
  onSelect: (brand: BrandSelectOption) => void
}

export function BrandOptionRow({ brand, onSelect }: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(brand)}
      className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-transparent px-3 py-2.5 text-left transition-colors hover:border-brand-soft-2 hover:bg-brand-soft"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandAvatar name={brand.name} size="sm" />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium text-ink">{brand.name}</div>
          <div className="text-[11px] text-muted">
            {brand.modelsCount} {brand.modelsCount === 1 ? 'modelo' : 'modelos'}
          </div>
        </div>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={14}
        strokeWidth={1.8}
        className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
      />
    </button>
  )
}
