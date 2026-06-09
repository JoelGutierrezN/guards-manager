import { type JSX } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { Checkbox, Empty, Pager, Button, Icon } from '../../../shared/infraestructure/components/ui'
import { PackageIcon } from '@hugeicons/core-free-icons'
import type { Tool } from '../../domain/tool.entity'
import { ToolTableToolbar } from './tool-table-toolbar.component'
import { ToolRow } from './tool-row.component'
import { MOCK_TOOLS_STATS } from '../mocks/tools-stats.mock'

interface Props {
  rows: Tool[]
  totalCount: number
  selectedIds: Set<number>
  allSelected: boolean
  someSelected: boolean
  showFilters: boolean
  density: 'dense' | 'comfy'
  page: number
  onToggleFilters: () => void
  onSetDensity: (density: 'dense' | 'comfy') => void
  onToggleSelectAll: () => void
  onToggleSelect: (id: number) => void
  onOpenIngreso: (tool: Tool) => void
  onClearFilters: () => void
  onSetPage: (page: number) => void
}

// TODO API: el total de páginas proviene de la paginación de GET /api/tools.
const TOTAL_PAGES = MOCK_TOOLS_STATS.pageCount

export function ToolTable({
  rows,
  totalCount,
  selectedIds,
  allSelected,
  someSelected,
  showFilters,
  density,
  page,
  onToggleFilters,
  onSetDensity,
  onToggleSelectAll,
  onToggleSelect,
  onOpenIngreso,
  onClearFilters,
  onSetPage,
}: Props): JSX.Element {
  return (
    <div className="overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <ToolTableToolbar
        showFilters={showFilters}
        onToggleFilters={onToggleFilters}
        density={density}
        onSetDensity={onSetDensity}
        selectedCount={selectedIds.size}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="sticky top-0 z-[1] w-8 border-b border-hairline bg-paper-tint px-3 py-2.5 text-left">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="sticky top-0 z-[1] cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                Herramienta
              </th>
              <th className="sticky top-0 z-[1] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                Marca
              </th>
              <th className="sticky top-0 z-[1] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                Modelo
              </th>
              <th className="sticky top-0 z-[1] cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-brand whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  Stock disp. / total
                  <Icon icon={ArrowDown01Icon} size={11} className="text-brand" />
                </span>
              </th>
              <th className="sticky top-0 z-[1] cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                Asign.
              </th>
              <th className="sticky top-0 z-[1] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                Estado
              </th>
              <th className="sticky top-0 z-[1] border-b border-hairline bg-paper-tint px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="border-b border-hairline">
                  <Empty
                    icon={PackageIcon}
                    title="Sin resultados"
                    body="Ajusta los filtros o limpia la búsqueda."
                    action={
                      <Button onClick={onClearFilters}>Limpiar filtros</Button>
                    }
                  />
                </td>
              </tr>
            ) : (
              rows.map((tool) => (
                <ToolRow
                  key={tool.id}
                  tool={tool}
                  selected={selectedIds.has(tool.id)}
                  onSelect={() => onToggleSelect(tool.id)}
                  onIngreso={() => onOpenIngreso(tool)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 text-[13px] text-muted">
        <span>
          Mostrando <b className="text-ink">{rows.length}</b> de {totalCount}
        </span>
        <Pager page={page} total={TOTAL_PAGES} onChange={onSetPage} />
      </div>
    </div>
  )
}
