import { type JSX } from 'react'
import { SearchInput } from '../../../shared/infraestructure/components/ui'

interface Props {
  query: string
  onQueryChange: (value: string) => void
}

export function UsersTableToolbar({ query, onQueryChange }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-end gap-2 border-b border-hairline bg-white px-3 py-3">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Buscar por nombre, usuario o correo…"
        ariaLabel="Buscar usuarios"
        className="h-8 max-w-[320px] flex-1"
      />
    </div>
  )
}
