import { type JSX } from 'react'
import { ArrowRight01Icon, CheckmarkCircle02Icon, PackageAddIcon } from '@hugeicons/core-free-icons'
import { Button, Icon } from '../../../shared/infraestructure/components/ui'
import type { StockInResult } from '../../domain/stock-in-result.model'
import { StockInSummaryMetric } from './stock-in-summary-metric.component'

interface Props {
  result: StockInResult
  onAnotherEntry: () => void
  onGoToTools: () => void
}

export function StockInSummary({ result, onAnotherEntry, onGoToTools }: Props): JSX.Element {
  return (
    <section className="rounded-[18px] border border-ok-soft bg-ok-soft p-5">
      <header className="mb-4 flex items-center gap-2 text-ok">
        <Icon icon={CheckmarkCircle02Icon} size={18} />
        <h2 className="m-0 text-[14px] font-semibold">
          Ingreso registrado · {result.createdCount} unidades de {result.product.name}
        </h2>
      </header>

      <div className="mb-4 rounded-[14px] border border-hairline bg-white px-4 py-3">
        <p className="m-0 text-[12px] text-muted">Folios asignados</p>
        <p className="m-0 font-mono text-[15px] font-semibold text-ink">
          {result.range.from} — {result.range.to}
        </p>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <StockInSummaryMetric label="Total" value={result.product.total} />
        <StockInSummaryMetric label="Disponibles" value={result.product.available} />
        <StockInSummaryMetric label="Asignadas" value={result.product.assigned} />
        <StockInSummaryMetric label="Inutilizables" value={result.product.unusable} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" icon={PackageAddIcon} onClick={onAnotherEntry}>
          Otro ingreso
        </Button>
        <Button iconRight={ArrowRight01Icon} onClick={onGoToTools}>
          Ver en Herramientas
        </Button>
      </div>
    </section>
  )
}
