import { type JSX, useMemo } from 'react'
import { FilterHorizontalIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  showFilters: boolean
  activeFilterCount: number
  onToggleFilters: () => void
}

export function ToolTableToolbar({
  showFilters,
  activeFilterCount,
  onToggleFilters,
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
      <button type="button" onClick={onToggleFilters} aria-pressed={showFilters} className={toggleClass}>
        <Icon icon={FilterHorizontalIcon} size={13} />
        <span>Filtros</span>
        {activeFilterCount > 0 && <span className={badgeClass}>{activeFilterCount}</span>}
      </button>

      {/* TODO API: la búsqueda se envía como query param a GET /api/tools (?q=). */}
      <div className="flex h-8 max-w-[320px] flex-1 items-center gap-2 rounded-full border border-hairline-strong bg-white px-3">
        <Icon icon={Search01Icon} size={13} className="shrink-0 text-muted" />
        <input
          className="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-[13px] text-ink outline-none placeholder:text-muted-soft"
          placeholder="Buscar por nombre, modelo o SKU…"
        />
      </div>
    </div>
  )
}
