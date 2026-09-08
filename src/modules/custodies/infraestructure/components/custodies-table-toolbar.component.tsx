import { type JSX } from 'react'
import { SearchInput } from '../../../shared/infraestructure/components/ui'
import type { CustodiesFilters } from '../../domain/custodies-filters.model'
import { CustodiesFiltersMenu } from './custodies-filters-menu.component'

/** `CustodyIndexRequest` valida `q` con `max:120`; se acota en origen para no provocar 422. */
const QUERY_MAX_LENGTH = 120

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
        maxLength={QUERY_MAX_LENGTH}
        className="h-8 max-w-[340px] flex-1"
      />
    </div>
  )
}
