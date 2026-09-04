import { type JSX } from 'react'
import { SearchInput } from '../../../shared/infraestructure/components/ui'
import type { EmployeesFilters } from '../../domain/employees-filters.model'
import { EmployeesFiltersMenu } from './employees-filters-menu.component'

interface Props {
  query: string
  filters: EmployeesFilters
  onQueryChange: (value: string) => void
  onFiltersChange: (filters: Partial<EmployeesFilters>) => void
  onClearFilters: () => void
}

export function EmployeesTableToolbar({
  query,
  filters,
  onQueryChange,
  onFiltersChange,
  onClearFilters,
}: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-hairline bg-white px-3 py-3">
      <EmployeesFiltersMenu filters={filters} onChange={onFiltersChange} onClear={onClearFilters} />
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Buscar por nombre o ETT-0001…"
        ariaLabel="Buscar personal"
        className="h-8 max-w-[320px] flex-1"
      />
    </div>
  )
}
