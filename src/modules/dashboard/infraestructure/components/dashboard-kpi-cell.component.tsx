import { type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { DashboardKpiCard, DashboardKpiTone } from '../../application/dashboard-kpi-card.model'
import type { DashboardCellVariant } from './dashboard-cell.model'
import { DashboardAnimatedNumber } from './dashboard-animated-number.component'
import { DashboardCell } from './dashboard-cell.component'
import { DashboardEyebrow } from './dashboard-eyebrow.component'

interface Props {
  card: DashboardKpiCard
}

const TONE_VARIANTS: Record<DashboardKpiTone, DashboardCellVariant> = {
  default: 'default',
  cream: 'cream',
  lavender: 'lavender',
}

export function DashboardKpiCell({ card }: Props): JSX.Element {
  return (
    <DashboardCell variant={TONE_VARIANTS[card.tone]} span={2} label={card.label}>
      <div className="flex items-center justify-between">
        <DashboardEyebrow>{card.label}</DashboardEyebrow>
        <span className="text-brand">
          <HugeiconsIcon icon={card.icon} size={18} strokeWidth={1.8} />
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="text-[40px] leading-none font-normal tracking-[-0.035em] text-ink [font-feature-settings:'tnum']">
          <DashboardAnimatedNumber value={card.value} />
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          {card.caption}
        </div>
      </div>
    </DashboardCell>
  )
}
