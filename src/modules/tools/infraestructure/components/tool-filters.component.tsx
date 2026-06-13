import { type JSX } from 'react'
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { Icon } from '../../../shared/infraestructure/components/ui'
import type { ToolFilters } from '../../domain/tool-filters.model'
import { DEFAULT_STOCK_RANGE } from '../../application/tools-state.model'
import { ToolFilterBrandNode } from './tool-filter-brand-node.component'
import { ToolStockRange } from './tool-stock-range.component'
// TODO API: el árbol marca→modelos y sus conteos provienen de GET /api/catalog/tree.
import { MOCK_CATALOG_TREE } from '../mocks/catalog.mock'

interface Props {
  filters: ToolFilters
  onToggleBrand: (brand: string) => void
  onToggleModel: (model: string) => void
  onSetStockRange: (range: [number, number]) => void
  onClearFilters: () => void
}

export function ToolFiltersPanel({
  filters,
  onToggleBrand,
  onToggleModel,
  onSetStockRange,
  onClearFilters,
}: Props): JSX.Element {
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
          Rango de stock
        </div>
        <ToolStockRange
          value={filters.stockRange}
          min={DEFAULT_STOCK_RANGE[0]}
          max={DEFAULT_STOCK_RANGE[1]}
          onChange={onSetStockRange}
        />
      </div>

      <div className="border-t border-hairline px-3.5 py-3">
        <div className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Marca
        </div>
        <div className="flex flex-col gap-1">
          {MOCK_CATALOG_TREE.map((node) => (
            <ToolFilterBrandNode
              key={node.brand}
              node={node}
              selectedBrands={filters.brands}
              selectedModels={filters.models}
              onToggleBrand={onToggleBrand}
              onToggleModel={onToggleModel}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
