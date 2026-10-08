import { type JSX, useMemo } from 'react'
import { PackageIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { ScrollShadow } from '@heroui/react'
import { Empty, Pager, Button } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import type { ToolsSort, ToolsSortKey } from '../../domain/tools-sort.model'
import type { ToolsStatus } from '../../application/tools-state.model'
import { ToolTableToolbar } from './tool-table-toolbar.component'
import { ToolTableSortHeader } from './tool-table-sort-header.component'
import { ToolRow } from './tool-row.component'
import { ToolRowSkeleton } from './tool-row-skeleton.component'

interface Props {
  rows: Tool[]
  status: ToolsStatus
  error: string | null
  total: number
  lastPage: number
  perPage: number
  showFilters: boolean
  activeFilterCount: number
  search: string
  sort: ToolsSort
  page: number
  onToggleFilters: () => void
  onClearFilters: () => void
  onSearchChange: (search: string) => void
  onToggleSort: (key: ToolsSortKey) => void
  onSetPage: (page: number) => void
  onReload: () => void
  onCreate: () => void
  onStock: (tool: Tool) => void
  onIngreso: (tool: Tool) => void
  onEdit: (tool: Tool) => void
  onDelete: (tool: Tool) => void
}

const HEADER_CELL =
  'sticky top-0 z-1 border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap'

export function ToolTable({
  rows,
  status,
  error,
  total,
  lastPage,
  perPage,
  showFilters,
  activeFilterCount,
  search,
  sort,
  page,
  onToggleFilters,
  onClearFilters,
  onSearchChange,
  onToggleSort,
  onSetPage,
  onReload,
  onCreate,
  onStock,
  onIngreso,
  onEdit,
  onDelete,
}: Props): JSX.Element {
  const skeletonSlots = useMemo(() => [...Array(perPage).keys()], [perPage])
  const isEmpty = status === 'ready' && rows.length === 0
  const isFiltered = activeFilterCount > 0 || search.trim() !== ''

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <ToolTableToolbar
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
        search={search}
        onToggleFilters={onToggleFilters}
        onSearchChange={onSearchChange}
      />

      <div className="h-135 scrollbar-gutter-stable">
        <ScrollShadow className="h-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={`${HEADER_CELL} min-w-[200px]`}>
                  <ToolTableSortHeader
                    label="Herramienta"
                    sortKey="name"
                    sort={sort}
                    onToggle={onToggleSort}
                  />
                </th>
                <th className={`${HEADER_CELL} w-64`}>Marca</th>
                <th className={`${HEADER_CELL} w-37.5`}>Modelo</th>
                <th className={`${HEADER_CELL} w-52.5`}>
                  <ToolTableSortHeader
                    label="Stock disp. / total"
                    sortKey="stock"
                    sort={sort}
                    onToggle={onToggleSort}
                  />
                </th>
                <th className={`${HEADER_CELL} w-22.5`}>Asign.</th>
                <th className={`${HEADER_CELL} w-37.5`} />
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
              {isEmpty && isFiltered && (
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
              {isEmpty && !isFiltered && (
                <tr>
                  <td colSpan={6} className="border-b border-hairline">
                    <Empty
                      icon={PackageIcon}
                      title="Aún no hay herramientas"
                      body="Registra la primera herramienta del catálogo para poder ingresar unidades."
                      action={
                        <Button variant="primary" icon={PlusSignIcon} onClick={onCreate}>
                          Nueva herramienta
                        </Button>
                      }
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
