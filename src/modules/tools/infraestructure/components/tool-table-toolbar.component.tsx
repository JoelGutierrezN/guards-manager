import { type JSX } from 'react'
import {
  SidebarLeft01Icon,
  Search01Icon,
  MinusSignIcon,
  PlusSignIcon,
  SlidersHorizontalIcon,
} from '@hugeicons/core-free-icons'
import {
  IconButton,
  Input,
  Segmented,
  SelectTrigger,
} from '../../../shared/infraestructure/components/ui'
import type { SegmentedItem } from '../../../shared/infraestructure/components/ui/segmented.model'
import { ToolBulkActions } from './tool-bulk-actions.component'

interface Props {
  showFilters: boolean
  onToggleFilters: () => void
  density: 'dense' | 'comfy'
  onSetDensity: (density: 'dense' | 'comfy') => void
  selectedCount: number
}

const DENSITY_ITEMS: SegmentedItem<'dense' | 'comfy'>[] = [
  { label: 'Compacto', value: 'dense', icon: MinusSignIcon },
  { label: 'Cómodo', value: 'comfy', icon: PlusSignIcon },
]

export function ToolTableToolbar({
  showFilters,
  onToggleFilters,
  density,
  onSetDensity,
  selectedCount,
}: Props): JSX.Element {
  // TODO API: la búsqueda y el orden se envían como query params a GET /api/tools (?search=&sort=).
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
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {selectedCount > 0 ? (
          <ToolBulkActions selectedCount={selectedCount} />
        ) : (
          <>
            <Segmented value={density} onChange={onSetDensity} items={DENSITY_ITEMS} />
            <SelectTrigger label="Ordenar:" value="Más asignadas" />
            <IconButton icon={SlidersHorizontalIcon} tip="Columnas" bordered />
          </>
        )}
      </div>
    </div>
  )
}
