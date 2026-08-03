import { type JSX, useMemo, useState } from 'react'
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { Icon, SearchInput } from '../../../shared/infraestructure/components/ui'
import type { ToolFilters } from '../../domain/tool-filters.model'
import type { CatalogBrandNode } from '../../domain/catalog-option.model'
import type { OverviewStatus } from '../../hooks/use-tools-overview.hook'
import { DEFAULT_STOCK_RANGE } from '../../application/tools-state.model'
import { CatalogSearchHelper } from '../helpers/catalog-search.helper'
import { ToolFilterBrandNode } from './tool-filter-brand-node.component'
import { ToolStockRange } from './tool-stock-range.component'
import { ScrollShadow } from '@heroui/react'

interface Props {
  brands: CatalogBrandNode[]
  maxStock: number
  status: OverviewStatus
  filters: ToolFilters
  onToggleBrand: (brand: string) => void
  onToggleModel: (model: string) => void
  onSetStockRange: (range: [number, number]) => void
  onClearFilters: () => void
  onReload: () => void
}

export function ToolFiltersPanel({
  brands,
  maxStock,
  status,
  filters,
  onToggleBrand,
  onToggleModel,
  onSetStockRange,
  onClearFilters,
  onReload,
}: Props): JSX.Element {
  const [catalogQuery, setCatalogQuery] = useState('')
  const searching = catalogQuery.trim() !== ''
  const filteredBrands = useMemo(
    () => CatalogSearchHelper.filter(brands, catalogQuery),
    [brands, catalogQuery],
  )

  const catalogSelected = filters.brands.length + filters.models.length
  const [minStock, maxStockFilter] = filters.stockRange
  const effectiveMax = maxStock > 0 ? maxStock : DEFAULT_STOCK_RANGE[1]
  const rangeActive = minStock > DEFAULT_STOCK_RANGE[0] || maxStockFilter < effectiveMax
  const rangeLabel = useMemo(
    () => `${minStock}–${maxStockFilter}${maxStockFilter >= effectiveMax ? '+' : ''}`,
    [minStock, maxStockFilter, effectiveMax],
  )

  return (
    <div className="flex h-full max-h-164 w-full flex-col rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)] overflow-hidden">
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

      {status === 'loading' && <FiltersPanelSkeleton />}

      {status === 'error' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6">
          <span className="text-center text-[12px] text-muted">No se pudo cargar el catálogo.</span>
          <button
            type="button"
            className="text-[12px] font-medium text-brand hover:text-brand-hover transition-colors"
            onClick={onReload}
          >
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <div className="border-b border-hairline px-3.5 py-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                Rango de stock
              </span>
              {rangeActive && (
                <span className="font-mono text-[11px] text-brand">{rangeLabel}</span>
              )}
            </div>
            <ToolStockRange
              value={filters.stockRange}
              min={DEFAULT_STOCK_RANGE[0]}
              max={effectiveMax}
              onChange={onSetStockRange}
            />
          </div>
          <div className="mb-2 flex items-center justify-between sticky top-0 px-3.5">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              Catálogo
            </span>
            {catalogSelected > 0 && (
              <span className="font-mono text-[11px] text-brand">{catalogSelected} sel.</span>
            )}
          </div>

          <div className="px-3.5 pb-2">
            <SearchInput
              value={catalogQuery}
              onChange={setCatalogQuery}
              placeholder="Buscar marca o modelo…"
              ariaLabel="Buscar marca o modelo"
              className="h-8 w-full"
            />
          </div>

          <ScrollShadow className="scrollbar-thin">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 py-3">
              {brands.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-6">
                  <span className="text-center text-[12px] text-muted">
                    No hay marcas disponibles.
                  </span>
                </div>
              ) : filteredBrands.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-6">
                  <span className="text-center text-[12px] text-muted">
                    Sin resultados para «{catalogQuery.trim()}».
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-px">
                  {filteredBrands.map((brandNode, index) => (
                    <ToolFilterBrandNode
                      key={brandNode.id}
                      node={brandNode}
                      selectedBrands={filters.brands}
                      selectedModels={filters.models}
                      defaultExpanded={index === 0}
                      forceExpanded={searching}
                      onToggleBrand={onToggleBrand}
                      onToggleModel={onToggleModel}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollShadow>
        </>
      )}
    </div>
  )
}

function FiltersPanelSkeleton(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-3 px-3.5 py-3 animate-pulse">
      <div className="h-3 w-24 rounded bg-cream-2" />
      <div className="h-4 w-full rounded bg-cream-2" />
      <div className="mt-2 h-px w-full bg-hairline" />
      <div className="h-3 w-16 rounded bg-cream-2" />
      {[1, 2, 3, 4].map((skeletonIndex) => (
        <div key={skeletonIndex} className="h-6 w-full rounded bg-cream-2" />
      ))}
    </div>
  )
}
