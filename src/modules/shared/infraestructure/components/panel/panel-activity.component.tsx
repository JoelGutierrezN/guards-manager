import { type JSX, useState } from 'react'
import { BentoCell } from './bento-cell.component'
import { Eyebrow, BentoTitle } from './panel-bits.component'
import { ActivityChart } from './activity-chart.component'
import { Segmented } from '../ui'
import { CHART_HEADINGS, type KpiKey } from './panel.data'

type Range = '7d' | '14d' | '30d'

interface PanelActivityProps {
  selected: KpiKey
}

export function PanelActivity({ selected }: PanelActivityProps): JSX.Element {
  const [range, setRange] = useState<Range>('14d')
  const heading = CHART_HEADINGS[selected]

  return (
    <BentoCell span={4} rowSpan={2}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Eyebrow>{heading.eyebrow}</Eyebrow>
          <BentoTitle className="mt-1.5">{heading.title}</BentoTitle>
        </div>
        <Segmented
          value={range}
          onChange={setRange}
          items={[
            { label: '7d', value: '7d' },
            { label: '14d', value: '14d' },
            { label: '30d', value: '30d' },
          ]}
        />
      </div>

      <ActivityChart />

      <div className="flex items-center gap-4 text-[12px] text-muted">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-2.5 bg-brand" />
          Asignadas
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0 w-2.5 border-t border-dashed border-muted" />
          Devueltas
        </span>
        <span className="ml-auto font-mono text-[11px]">14 días · 320 mov.</span>
      </div>
    </BentoCell>
  )
}
