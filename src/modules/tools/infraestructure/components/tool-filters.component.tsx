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
  const catalogSelected = filters.brands.length + filters.models.length
  const [minStock, maxStock] = filters.stockRange
  const rangeActive = minStock > DEFAULT_STOCK_RANGE[0] || maxStock < DEFAULT_STOCK_RANGE[1]
  const rangeLabel = `${minStock}–${maxStock}${maxStock >= DEFAULT_STOCK_RANGE[1] ? '+' : ''}`

  return (
    <div className="flex h-full w-full flex-col rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-3.5 py-3">
        <div className="flex items-center gap-2">
          <Icon icon={FilterHorizontalIcon} size={14} className="text-ink-2" />
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

      <div className="border-b border-hairline px-3.5 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            Rango de stock
          </span>
          {rangeActive && <span className="font-mono text-[11px] text-brand">{rangeLabel}</span>}
        </div>
        <ToolStockRange
          value={filters.stockRange}
          min={DEFAULT_STOCK_RANGE[0]}
          max={DEFAULT_STOCK_RANGE[1]}
          onChange={onSetStockRange}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            Catálogo
          </span>
          {catalogSelected > 0 && (
            <span className="font-mono text-[11px] text-brand">{catalogSelected} sel.</span>
          )}
        </div>
        <div className="flex flex-col gap-px">
          {MOCK_CATALOG_TREE.map((node, index) => (
            <ToolFilterBrandNode
              key={node.brand}
              node={node}
              selectedBrands={filters.brands}
              selectedModels={filters.models}
              defaultExpanded={index === 0}
              onToggleBrand={onToggleBrand}
              onToggleModel={onToggleModel}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
