import { type JSX, useMemo } from 'react'
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { Icon, SearchInput } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  showFilters: boolean
  activeFilterCount: number
  search: string
  onToggleFilters: () => void
  onSearchChange: (search: string) => void
}

export function ToolTableToolbar({
  showFilters,
  activeFilterCount,
  search,
  onToggleFilters,
  onSearchChange,
}: Props): JSX.Element {
  const toggleClass = useMemo(
    () =>
      cn(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border px-3 text-[13px] font-medium transition-colors',
        showFilters
          ? 'border-brand bg-brand text-white'
          : 'border-hairline-strong bg-white text-ink-2 hover:border-ink-3',
      ),
    [showFilters],
  )

  const badgeClass = useMemo(
    () =>
      cn(
        'rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-white',
        showFilters ? 'bg-white/25' : 'bg-brand',
      ),
    [showFilters],
  )

  return (
    <div className="flex items-center gap-2 border-b border-hairline bg-white px-3 py-2.5">
      <button
        type="button"
        onClick={onToggleFilters}
        aria-pressed={showFilters}
        className={toggleClass}
      >
        <Icon icon={FilterHorizontalIcon} size={13} />
        <span>Filtros</span>
        {activeFilterCount > 0 && <span className={badgeClass}>{activeFilterCount}</span>}
      </button>

      <SearchInput
        value={search}
        onChange={onSearchChange}
        ariaLabel="Buscar herramienta por nombre"
        placeholder="Buscar por nombre…"
        className="flex-1"
      />
    </div>
  )
}
