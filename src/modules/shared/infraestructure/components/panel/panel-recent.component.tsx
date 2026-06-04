import { type JSX } from 'react'
import { ArrowRight01Icon, FilterIcon } from '@hugeicons/core-free-icons'
import { BentoCell } from './bento-cell.component'
import { Eyebrow, BentoTitle } from './panel-bits.component'
import { Avatar, Button, Chip } from '../ui'
import { RECENT_ASSIGNMENTS, STATUS_TONE, type RecentAssignment } from './panel.data'

export function PanelRecent(): JSX.Element {
  return (
    <BentoCell span={6}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Eyebrow>Asignaciones</Eyebrow>
          <BentoTitle className="mt-1.5">Actividad reciente</BentoTitle>
        </div>
        <div className="flex gap-2">
          <Button size="sm" icon={FilterIcon}>
            Filtrar
          </Button>
          <Button size="sm" iconRight={ArrowRight01Icon}>
            Ver todas
          </Button>
        </div>
      </div>

      <div>
        {RECENT_ASSIGNMENTS.map((row) => (
          <RecentRow key={row.id} {...row} />
        ))}
      </div>
    </BentoCell>
  )
}

function RecentRow({ id, name, code, count, when, status }: RecentAssignment): JSX.Element {
  return (
    <div className="flex items-center gap-3 border-b border-hairline py-2.5">
      <span className="w-14 font-mono text-[11px] text-muted">{id}</span>
      <Avatar name={name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-ink">{name}</div>
        <div className="font-mono text-[11px] text-muted">
          {code} · {count} herramientas
        </div>
      </div>
      <span className="mr-2 font-mono text-[11px] text-muted">{when}</span>
      <Chip tone={STATUS_TONE[status]} size="sm" dot>
        {status}
      </Chip>
    </div>
  )
}
