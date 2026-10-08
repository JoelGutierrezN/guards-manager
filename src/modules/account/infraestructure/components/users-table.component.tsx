import { type JSX, useMemo } from 'react'
import { ScrollShadow } from '@heroui/react'
import { UserMultipleIcon } from '@hugeicons/core-free-icons'
import { Button, Empty, Pager } from '../../../shared/infraestructure/components/ui'
import { TableLoader } from '../../../shared/infraestructure/components/tables/table-loader.component'
import { TableEmptyContent } from '../../../shared/infraestructure/components/tables/table-empty-content.component'
import type { User } from '../../domain/user.entity'
import type { UsersStatus } from '../../application/users-state.model'
import { USERS_COLUMNS } from './users-table-columns.model'
import { UsersTableHeaderCell } from './users-table-header-cell.component'
import { UsersTableToolbar } from './users-table-toolbar.component'
import { UserRow } from './user-row.component'

interface Props {
  rows: User[]
  status: UsersStatus
  query: string
  page: number
  lastPage: number
  total: number
  onQueryChange: (value: string) => void
  onSetPage: (page: number) => void
  onReload: () => void
  onClearQuery: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({
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
  onEdit,
  onDelete,
}: Props): JSX.Element {
  const columnCount = USERS_COLUMNS.length
  const isEmpty = status === 'ready' && rows.length === 0
  const hasQuery = query.trim() !== ''
  const showNoResults = isEmpty && hasQuery
  const showEmptyContent = status === 'error' || (isEmpty && !hasQuery)

  const noResultsBody = useMemo(() => `No hay usuarios que coincidan con “${query}”.`, [query])

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <UsersTableToolbar query={query} onQueryChange={onQueryChange} />

      <div className="xl:h-125 scrollbar-gutter-stable">
        <ScrollShadow className="h-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr>
                {USERS_COLUMNS.map((column) => (
                  <UsersTableHeaderCell key={column.key} column={column} />
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
                      body={noResultsBody}
                      action={<Button onClick={onClearQuery}>Limpiar búsqueda</Button>}
                    />
                  </td>
                </tr>
              )}
              {status === 'ready' &&
                rows.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={() => onEdit(user)}
                    onDelete={() => onDelete(user)}
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
          itemsLabel="usuarios"
        />
      </div>
    </div>
  )
}
