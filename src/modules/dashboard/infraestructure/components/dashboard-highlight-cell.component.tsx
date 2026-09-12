import { type JSX } from 'react'
import { ArrowRight01Icon, Task01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { DashboardKpis } from '../../domain/dashboard-kpis.model'
import { DashboardAnimatedNumber } from './dashboard-animated-number.component'
import { DashboardCell } from './dashboard-cell.component'
import { DashboardEyebrow } from './dashboard-eyebrow.component'
import { DashboardHighlightPill } from './dashboard-highlight-pill.component'

interface Props {
  kpis: DashboardKpis
  onViewAssignments: () => void
}

export function DashboardHighlightCell({ kpis, onViewAssignments }: Props): JSX.Element {
  return (
    <DashboardCell variant="accent" span={2} rowSpan={2} label="Resguardos activos">
      <div className="flex items-center justify-between">
        <DashboardEyebrow tone="inverted">Resguardos activos</DashboardEyebrow>
        <span className="text-white/85">
          <HugeiconsIcon icon={Task01Icon} size={22} strokeWidth={1.8} />
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="font-display text-[clamp(44px,5.4vw,72px)] leading-none tracking-[-0.035em]">
          <DashboardAnimatedNumber value={kpis.custodiesActive} />
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-white/60 uppercase">
          resguardos en curso
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <DashboardHighlightPill>
          {kpis.pendingSignatures.toLocaleString('es-MX')} por firmar
        </DashboardHighlightPill>
        <DashboardHighlightPill>
          {kpis.alerts.toLocaleString('es-MX')} alertas
        </DashboardHighlightPill>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 text-[12px] text-white/70">
        <span>Operación diaria</span>
        <button
          type="button"
          onClick={onViewAssignments}
          className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-white underline-offset-4 hover:underline"
        >
          Ver todas
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={1.8} />
        </button>
      </div>
    </DashboardCell>
  )
}
