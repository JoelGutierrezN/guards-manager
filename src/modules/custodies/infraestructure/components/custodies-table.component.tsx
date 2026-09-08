import { type JSX, useMemo } from 'react'
import { ScrollShadow } from '@heroui/react'
import { ClipboardIcon } from '@hugeicons/core-free-icons'
import { Button, Empty, Pager } from '../../../shared/infraestructure/components/ui'
import { TableLoader } from '../../../shared/infraestructure/components/tables/table-loader.component'
import { TableEmptyContent } from '../../../shared/infraestructure/components/tables/table-empty-content.component'
import type { Custody } from '../../domain/custody.entity'
import type { CustodiesFilters } from '../../domain/custodies-filters.model'
import type { CustodiesStatus } from '../../application/custodies-state.model'
import { CustodiesFiltersHelper } from '../../application/custodies-filters.helper'
import { CUSTODIES_COLUMNS } from './custodies-table-columns.model'
import { CustodiesTableHeaderCell } from './custodies-table-header-cell.component'
import { CustodiesTableToolbar } from './custodies-table-toolbar.component'
import { CustodyRow } from './custody-row.component'

interface Props {
  rows: Custody[]
  status: CustodiesStatus
  query: string
  filters: CustodiesFilters
  page: number
  lastPage: number
  total: number
  onQueryChange: (value: string) => void
  onFiltersChange: (filters: Partial<CustodiesFilters>) => void
  onClearFilters: () => void
  onSetPage: (page: number) => void
  onReload: () => void
  onClearQuery: () => void
  onOpen: (custody: Custody) => void
}

export function CustodiesTable({
  rows,
  status,
  query,
  filters,
  page,
  lastPage,
  total,
  onQueryChange,
  onFiltersChange,
  onClearFilters,
  onSetPage,
  onReload,
  onClearQuery,
  onOpen,
}: Props): JSX.Element {
  const columnCount = CUSTODIES_COLUMNS.length
  const isEmpty = status === 'ready' && rows.length === 0
  const hasQuery = query.trim() !== ''
  const hasFilters = CustodiesFiltersHelper.hasActive(filters)
  const showNoResults = isEmpty && (hasQuery || hasFilters)
  const showEmptyContent = status === 'error' || (isEmpty && !hasQuery && !hasFilters)

  const noResultsBody = useMemo(
    () =>
      hasQuery
        ? `No hay resguardos que coincidan con “${query}”.`
        : 'No hay resguardos que coincidan con los filtros seleccionados.',
    [hasQuery, query],
  )

  const clearNoResults = (): void => {
    if (hasQuery) onClearQuery()
    if (hasFilters) onClearFilters()
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <CustodiesTableToolbar
        query={query}
        filters={filters}
        onQueryChange={onQueryChange}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />

      <div className="xl:h-125 scrollbar-gutter-stable">
        <ScrollShadow className="h-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr>
                {CUSTODIES_COLUMNS.map((column) => (
                  <CustodiesTableHeaderCell key={column.key} column={column} />
                ))}
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && <TableLoader width={columnCount} />}
              {showEmptyContent && (
                <TableEmptyContent
                  hasError={status === 'error'}
                  onReload={onReload}
                  width={columnCount}
                  icon={ClipboardIcon}
                />
              )}
              {showNoResults && (
                <tr>
                  <td colSpan={columnCount} className="border-b border-hairline lg:h-125">
                    <Empty
                      icon={ClipboardIcon}
                      title="Sin resultados"
                      body={noResultsBody}
                      action={
                        <Button onClick={clearNoResults}>
                          {hasQuery ? 'Limpiar búsqueda' : 'Limpiar filtros'}
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}
              {status === 'ready' &&
                rows.map((custody) => (
                  <CustodyRow key={custody.id} custody={custody} onOpen={() => onOpen(custody)} />
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
          itemsLabel="resguardos"
        />
      </div>
    </div>
  )
}
