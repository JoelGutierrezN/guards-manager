import { type JSX, useMemo } from 'react'
import { PackageDeliveredIcon } from '@hugeicons/core-free-icons'
import { Button, Empty, Pager } from '../../../shared/infraestructure/components/ui'
import type { CustodyReturnSummary } from '../../domain/custody.entity'
import { useCustodyReturns } from '../../hooks/use-custody-returns.hook'
import { CustodyReturnRow } from './custody-return-row.component'

interface Props {
  custodyId: string
  returns: CustodyReturnSummary[]
}

export function CustodyReturnsPanel({ custodyId, returns }: Props): JSX.Element {
  const {
    returns: visibleReturns,
    page,
    lastPage,
    total,
    loading,
    error,
    isPaginated,
    setPage,
  } = useCustodyReturns(custodyId, returns)

  const listClassName = useMemo(() => (loading ? 'opacity-60' : undefined), [loading])
  const headerCount = isPaginated ? total : returns.length
  const showEmpty = error == null && !loading && visibleReturns.length === 0

  const retryPage = (): void => setPage(page)

  return (
    <section className="overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h2 className="text-[14px] font-semibold text-ink">Historial de devoluciones</h2>
        <span className="font-mono text-[11px] text-muted">{headerCount}</span>
      </header>

      {error != null && (
        <Empty
          icon={PackageDeliveredIcon}
          title="No se pudo cargar el historial"
          body={error}
          action={<Button onClick={retryPage}>Reintentar</Button>}
        />
      )}

      {showEmpty && (
        <Empty
          icon={PackageDeliveredIcon}
          title="Sin devoluciones"
          body="Todavía no se registra ninguna devolución para este resguardo."
        />
      )}

      {error == null && visibleReturns.length > 0 && (
        <ul className={listClassName}>
          {visibleReturns.map((entry) => (
            <CustodyReturnRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}

      {isPaginated && error == null && (
        <div className="px-4 pb-3">
          <Pager
            page={page}
            lastPage={lastPage}
            total={total}
            onChange={setPage}
            itemsLabel="devoluciones"
          />
        </div>
      )}
    </section>
  )
}
