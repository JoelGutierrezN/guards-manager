import { type JSX, useMemo } from 'react'
import { ArrowDown01Icon, PackageIcon } from '@hugeicons/core-free-icons'
import { Empty, Pager, Button, Icon } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import type { ToolsStatus } from '../../application/tools-state.model'
import { ToolTableToolbar } from './tool-table-toolbar.component'
import { ToolRow } from './tool-row.component'
import { ToolRowSkeleton } from './tool-row-skeleton.component'
import { ScrollShadow } from '@heroui/react'

interface Props {
  rows: Tool[]
  status: ToolsStatus
  error: string | null
  total: number
  lastPage: number
  perPage: number
  showFilters: boolean
  activeFilterCount: number
  page: number
  onToggleFilters: () => void
  onClearFilters: () => void
  onSetPage: (page: number) => void
  onReload: () => void
  onStock: (tool: Tool) => void
  onIngreso: (tool: Tool) => void
  onEdit: (tool: Tool) => void
  onDelete: (tool: Tool) => void
}

export function ToolTable({
  rows,
  status,
  error,
  total,
  lastPage,
  perPage,
  showFilters,
  activeFilterCount,
  page,
  onToggleFilters,
  onClearFilters,
  onSetPage,
  onReload,
  onStock,
  onIngreso,
  onEdit,
  onDelete,
}: Props): JSX.Element {
  const skeletonSlots = useMemo(() => [...Array(perPage).keys()], [perPage])
  const isEmpty = status === 'ready' && rows.length === 0
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <ToolTableToolbar
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
        onToggleFilters={onToggleFilters}
      />

      <div className="h-135 scrollbar-gutter-stable">
        <ScrollShadow className="h-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="sticky top-0 z-1 cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                  Herramienta
                </th>
                <th className="sticky top-0 z-1 w-64 border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                  Marca
                </th>
                <th className="sticky top-0 z-1 w-37.5 border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap">
                  Modelo
                </th>
                {/* TODO API: el orden por stock se envía a GET /api/tools (?sort=); aquí solo es indicador visual. */}
                <th className="sticky top-0 z-1 w-52.5 cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-brand whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    Stock disp. / total
                    <Icon icon={ArrowDown01Icon} size={11} className="text-brand" />
                  </span>
                </th>
                <th className="sticky top-0 z-1 w-22.5 cursor-pointer select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                  Asign.
                </th>
                <th className="sticky top-0 z-1 w-37.5 border-b border-hairline bg-paper-tint px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && skeletonSlots.map((slot) => <ToolRowSkeleton key={slot} />)}
              {status === 'error' && (
                <tr>
                  <td colSpan={6} className="border-b border-hairline">
                    <Empty
                      icon={PackageIcon}
                      title="Error al cargar"
                      body={error ?? 'No se pudieron cargar las herramientas.'}
                      action={<Button onClick={onReload}>Reintentar</Button>}
                    />
                  </td>
                </tr>
              )}
              {isEmpty && (
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
              )}
              {status === 'ready' &&
                rows.map((tool) => (
                  <ToolRow
                    key={tool.id}
                    tool={tool}
                    onStock={() => onStock(tool)}
                    onIngreso={() => onIngreso(tool)}
                    onEdit={() => onEdit(tool)}
                    onDelete={() => onDelete(tool)}
                  />
                ))}
            </tbody>
          </table>
        </ScrollShadow>
      </div>

      <div className="border-t border-hairline px-4 pb-2.5 text-[13px] text-muted">
        <Pager
          page={page}
          lastPage={lastPage}
          total={total}
          onChange={onSetPage}
          itemsLabel="herramientas"
        />
      </div>
    </div>
  )
}
