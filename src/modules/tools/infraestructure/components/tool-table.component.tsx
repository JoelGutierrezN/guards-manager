import { type JSX } from 'react'
import { ArrowDown01Icon, PackageIcon } from '@hugeicons/core-free-icons'
import { Empty, Pager, Button, Icon } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import { ToolTableToolbar } from './tool-table-toolbar.component'
import { ToolRow } from './tool-row.component'
import { MOCK_TOOLS_STATS } from '../mocks/tools-stats.mock'

interface Props {
  rows: Tool[]
  totalCount: number
  showFilters: boolean
  activeFilterCount: number
  page: number
  onToggleFilters: () => void
  onClearFilters: () => void
  onSetPage: (page: number) => void
  onStock: (tool: Tool) => void
  onIngreso: (tool: Tool) => void
  onEdit: (tool: Tool) => void
  onDelete: (tool: Tool) => void
}

// TODO API: el total de páginas proviene de la paginación de GET /api/tools.
const TOTAL_PAGES = MOCK_TOOLS_STATS.pageCount

export function ToolTable({
  rows,
  totalCount,
  showFilters,
  activeFilterCount,
  page,
  onToggleFilters,
  onClearFilters,
  onSetPage,
  onStock,
  onIngreso,
  onEdit,
  onDelete,
}: Props): JSX.Element {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <ToolTableToolbar
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
        onToggleFilters={onToggleFilters}
      />

      <div className="h-[540px] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
        <table className="w-full table-fixed border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="sticky top-0 z-[1] cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                Herramienta
              </th>
              <th className="sticky top-0 z-[1] w-[120px] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                Marca
              </th>
              <th className="sticky top-0 z-[1] w-[150px] border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                Modelo
              </th>
              {/* TODO API: el orden por stock se envía a GET /api/tools (?sort=); aquí solo es indicador visual. */}
              <th className="sticky top-0 z-[1] w-[210px] cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-brand whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  Stock disp. / total
                  <Icon icon={ArrowDown01Icon} size={11} className="text-brand" />
                </span>
              </th>
              <th className="sticky top-0 z-[1] w-[90px] cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                Asign.
              </th>
              <th className="sticky top-0 z-[1] w-[150px] border-b border-hairline bg-paper-tint px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="border-b border-hairline">
                  <Empty
                    icon={PackageIcon}
                    title="Sin resultados"
                    body="Ajusta los filtros o limpia la búsqueda."
                    action={<Button onClick={onClearFilters}>Limpiar filtros</Button>}
                  />
                </td>
              </tr>
            ) : (
              rows.map((tool) => (
                <ToolRow
                  key={tool.id}
                  tool={tool}
                  onStock={() => onStock(tool)}
                  onIngreso={() => onIngreso(tool)}
                  onEdit={() => onEdit(tool)}
                  onDelete={() => onDelete(tool)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-hairline px-4 pb-2.5 text-[13px] text-muted">
        <Pager page={page} lastPage={TOTAL_PAGES} total={totalCount} onChange={onSetPage} itemsLabel="herramientas" />
      </div>
    </div>
  )
}
