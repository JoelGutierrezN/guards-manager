import { type JSX } from 'react'
import {
  SidebarLeft01Icon,
  Search01Icon,
  SlidersHorizontalIcon,
} from '@hugeicons/core-free-icons'
import {
  IconButton,
  Input,
  SelectTrigger,
} from '../../../shared/infraestructure/components/ui'

interface Props {
  showFilters: boolean
  onToggleFilters: () => void
  searchQuery: string
  onSearch: (query: string) => void
}

export function ToolTableToolbar({
  showFilters,
  onToggleFilters,
  searchQuery,
  onSearch,
}: Props): JSX.Element {
  // TODO API: la búsqueda y el orden se envían como query params a GET /api/tools (?q=&sort=).
  return (
    <div className="flex items-center gap-2 border-b border-hairline bg-white px-3 py-2.5">
      <IconButton
        icon={SidebarLeft01Icon}
        tip={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        onClick={onToggleFilters}
        bordered
      />
      <div className="max-w-[320px] flex-1">
        <Input
          leadIcon={Search01Icon}
          placeholder="Buscar por nombre, modelo o SKU…"
          value={searchQuery}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <SelectTrigger label="Ordenar:" value="Más asignadas" />
        <IconButton icon={SlidersHorizontalIcon} tip="Columnas" bordered />
      </div>
    </div>
  )
}
