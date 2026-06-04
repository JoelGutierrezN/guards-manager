import { type JSX, useState } from 'react'
import './panel.css'
import { PanelHero } from './panel-hero.component'
import { PanelFeatures } from './panel-features.component'
import { PanelKpis } from './panel-kpis.component'
import { PanelActivity } from './panel-activity.component'
import { PanelRecent } from './panel-recent.component'
import type { KpiKey } from './panel.data'

export function Panel(): JSX.Element {
  const [selectedKpi, setSelectedKpi] = useState<KpiKey>('open')

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <PanelHero />
      <PanelFeatures />

      <div className="mt-6 grid grid-cols-6 auto-rows-[minmax(170px,auto)] gap-3.5 [grid-auto-flow:dense]">
        <PanelKpis selected={selectedKpi} onSelect={setSelectedKpi} />
        <PanelActivity selected={selectedKpi} />
        <PanelRecent />
      </div>
    </div>
  )
}
