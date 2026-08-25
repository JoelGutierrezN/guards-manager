import { type JSX } from 'react'
import { ScrollShadow } from '@heroui/react'
import { UserMultipleIcon } from '@hugeicons/core-free-icons'
import { Button, Empty, Pager } from '../../../shared/infraestructure/components/ui'
import { TableLoader } from '../../../shared/infraestructure/components/tables/table-loader.component'
import { TableEmptyContent } from '../../../shared/infraestructure/components/tables/table-empty-content.component'
import type { Employee } from '../../domain/employee.entity'
import type { EmployeesStatus } from '../../application/employees-state.model'
import { EMPLOYEES_COLUMNS } from './employees-table-columns.model'
import { EmployeesTableHeaderCell } from './employees-table-header-cell.component'
import { EmployeesTableToolbar } from './employees-table-toolbar.component'
import { EmployeeRow } from './employee-row.component'

interface Props {
  rows: Employee[]
  status: EmployeesStatus
  query: string
  page: number
  lastPage: number
  total: number
  onQueryChange: (value: string) => void
  onSetPage: (page: number) => void
  onReload: () => void
  onClearQuery: () => void
}

export function EmployeesTable({
  rows,
  status,
  query,
  page,
  lastPage,
  total,
  onQueryChange,
  onSetPage,
  onReload,
  onClearQuery,
}: Props): JSX.Element {
  const columnCount = EMPLOYEES_COLUMNS.length
  const isEmpty = status === 'ready' && rows.length === 0
  const hasQuery = query.trim() !== ''
  const showNoResults = isEmpty && hasQuery
  const showEmptyContent = status === 'error' || (isEmpty && !hasQuery)

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <EmployeesTableToolbar query={query} onQueryChange={onQueryChange} />

      <div className="xl:h-125 scrollbar-gutter-stable">
        <ScrollShadow className="h-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr>
                {EMPLOYEES_COLUMNS.map((column) => (
                  <EmployeesTableHeaderCell key={column.key} column={column} />
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
                  icon={UserMultipleIcon}
                />
              )}
              {showNoResults && (
                <tr>
                  <td colSpan={columnCount} className="border-b border-hairline lg:h-125">
                    <Empty
                      icon={UserMultipleIcon}
                      title="Sin resultados"
                      body={`No hay personal que coincida con “${query}”.`}
                      action={<Button onClick={onClearQuery}>Limpiar búsqueda</Button>}
                    />
                  </td>
                </tr>
              )}
              {status === 'ready' &&
                rows.map((employee) => <EmployeeRow key={employee.id} employee={employee} />)}
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
          itemsLabel="colaboradores"
        />
      </div>
    </div>
  )
}
