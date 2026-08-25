import { type JSX } from 'react'
import { SearchInput } from '../../../shared/infraestructure/components/ui'

interface Props {
  query: string
  onQueryChange: (value: string) => void
}

export function EmployeesTableToolbar({ query, onQueryChange }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-2 border-b border-hairline bg-white px-3 py-2.5">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Buscar por nombre o ETT-0001…"
        ariaLabel="Buscar personal"
        className="flex-1"
      />
    </div>
  )
}
