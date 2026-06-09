import { type JSX } from 'react'
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { Icon } from '../../../shared/infraestructure/components/ui'
import type { ToolFilters } from '../../domain/tool-filters.model'
import { ToolFilterCheckItem } from './tool-filter-check-item.component'
import { MOCK_TOOLS_STATS } from '../mocks/tools-stats.mock'
import { MOCK_BRANDS } from '../mocks/catalog.mock'

interface Props {
  filters: ToolFilters
  onToggleBrand: (brand: string) => void
  onToggleStatus: (status: string) => void
  onClearFilters: () => void
}

const STATUS_OPTIONS = [
  { key: 'ok', label: 'Disponible' },
  { key: 'warn', label: 'Stock bajo' },
  { key: 'low', label: 'Agotado' },
  { key: 'mantto', label: 'Mantenimiento' },
  { key: 'baja', label: 'Baja / perdida' },
]

// TODO API: el catálogo de marcas y todos los conteos/rango provienen de GET /api/brands + GET /api/tools/stats.
const BRAND_OPTIONS = MOCK_BRANDS.map((brand) => ({ key: brand.value, label: brand.label }))

export function ToolFiltersPanel({ filters, onToggleBrand, onToggleStatus, onClearFilters }: Props): JSX.Element {
  return (
    <div className="rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-3.5 py-3">
        <div className="flex items-center gap-2">
          <Icon icon={FilterHorizontalIcon} size={14} className="text-muted" />
          <span className="text-[13px] font-semibold text-ink">Filtros</span>
        </div>
        <button
          type="button"
          className="text-[12px] text-brand hover:text-brand-hover transition-colors"
          onClick={onClearFilters}
        >
          Limpiar
        </button>
      </div>

      <div className="px-3.5 py-3">
        <div className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Estado
        </div>
        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map((option) => (
            <ToolFilterCheckItem
              key={option.key}
              filterKey={option.key}
              label={option.label}
              count={MOCK_TOOLS_STATS.statusCounts[option.key] ?? 0}
              checked={filters.statuses.includes(option.key)}
              onToggle={onToggleStatus}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-hairline px-3.5 py-3">
        <div className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Marca
        </div>
        <div className="flex flex-col gap-1">
          {BRAND_OPTIONS.map((option) => (
            <ToolFilterCheckItem
              key={option.key}
              filterKey={option.key}
              label={option.label}
              count={MOCK_TOOLS_STATS.brandCounts[option.key] ?? 0}
              checked={filters.brands.includes(option.key)}
              onToggle={onToggleBrand}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-hairline px-3.5 py-3">
        <div className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Rango de stock
        </div>
        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
          <span>{MOCK_TOOLS_STATS.stockRange.min}</span>
          <span>{MOCK_TOOLS_STATS.stockRange.max}</span>
        </div>
        <div className="relative mt-1.5 h-1 rounded-full bg-cream-2">
          <div className="absolute left-[10%] right-[30%] h-full rounded-full bg-brand" />
          <div className="absolute left-[10%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-brand bg-white" />
          <div className="absolute left-[70%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-brand bg-white" />
        </div>
      </div>
    </div>
  )
}
