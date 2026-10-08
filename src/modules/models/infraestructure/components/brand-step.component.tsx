import { type JSX } from 'react'
import { SearchInput } from '../../../shared/infraestructure/components/ui'
import type { BrandSelectOption } from '../../../brands/domain/brand-select.model'
import { BrandOptionRow } from './brand-option-row.component'

interface Props {
  search: string
  brands: BrandSelectOption[]
  onSearchChange: (search: string) => void
  onSelect: (brand: BrandSelectOption) => void
}

export function BrandStep({ search, brands, onSearchChange, onSelect }: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar marca…"
        ariaLabel="Buscar marca"
        className="h-[42px] max-w-none"
      />
      <div className="flex h-72 flex-col gap-0.5 overflow-y-auto rounded-[14px] border border-hairline p-1.5">
        {brands.map((brand) => (
          <BrandOptionRow key={brand.id} brand={brand} onSelect={onSelect} />
        ))}
        {brands.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-10 text-[13px] text-muted">
            Sin resultados para «{search}».
          </div>
        )}
      </div>
    </div>
  )
}
