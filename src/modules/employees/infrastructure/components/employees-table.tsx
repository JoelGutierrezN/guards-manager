import { ScrollShadow } from '@heroui/react'

const COLUMNS: string[] = ['Nombre', 'Rol', 'Resguardos activos', 'Histórico', 'Fecha de alta', '']

export const EmployeesTable = () => {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <div className="h-135 scrollbar-gutter-stable">
        2
        <ScrollShadow className="h-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th className="sticky top-0 z-1 select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap hover:text-ink">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/*status === 'loading' && skeletonSlots.map((slot) => <ToolRowSkeleton key={slot} />)*/}
              {/*status === 'error' && (
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
              )*/}
              {/*isEmpty && (
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
              )*/}
              {/*status === 'ready' &&
                rows.map((tool) => (
                  <ToolRow
                    key={tool.id}
                    tool={tool}
                    onStock={() => onStock(tool)}
                    onIngreso={() => onIngreso(tool)}
                    onEdit={() => onEdit(tool)}
                    onDelete={() => onDelete(tool)}
                  />
                ))*/}
            </tbody>
          </table>
        </ScrollShadow>
      </div>

      {/*
      <div className="border-t border-hairline px-4 pb-2.5 text-[13px] text-muted">
        <Pager
          page={page}
          lastPage={lastPage}
          total={total}
          onChange={onSetPage}
          itemsLabel="herramientas"
        />
      </div>
      */}
    </div>
  )
}
