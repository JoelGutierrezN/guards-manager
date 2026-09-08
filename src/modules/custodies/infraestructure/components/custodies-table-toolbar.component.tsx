import { type JSX } from 'react'
import { SearchInput } from '../../../shared/infraestructure/components/ui'
import type { CustodiesFilters } from '../../domain/custodies-filters.model'
import { CustodiesFiltersMenu } from './custodies-filters-menu.component'

interface Props {
  query: string
  filters: CustodiesFilters
  onQueryChange: (value: string) => void
  onFiltersChange: (filters: Partial<CustodiesFilters>) => void
  onClearFilters: () => void
}

export function CustodiesTableToolbar({
  query,
  filters,
  onQueryChange,
  onFiltersChange,
  onClearFilters,
}: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-hairline bg-white px-3 py-3">
      <CustodiesFiltersMenu filters={filters} onChange={onFiltersChange} onClear={onClearFilters} />
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Buscar por folio, nombre o ETT-0001…"
        ariaLabel="Buscar resguardos"
        className="h-8 max-w-[340px] flex-1"
      />
    </div>
  )
}
