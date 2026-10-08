import { type JSX } from 'react'
import { ArrowRight01Icon, InboxIcon } from '@hugeicons/core-free-icons'
import { Button, Empty } from '../../../shared/infraestructure/components/ui'
import type { DashboardRecentActivity } from '../../domain/dashboard-recent-activity.model'
import { DashboardCell } from './dashboard-cell.component'
import { DashboardCellTitle } from './dashboard-cell-title.component'
import { DashboardEyebrow } from './dashboard-eyebrow.component'
import { DashboardRecentRow } from './dashboard-recent-row.component'

interface Props {
  activities: DashboardRecentActivity[]
  onOpenActivity: (activity: DashboardRecentActivity) => void
  onViewAssignments: () => void
}

export function DashboardRecentCell({
  activities,
  onOpenActivity,
  onViewAssignments,
}: Props): JSX.Element {
  return (
    <DashboardCell span={6} label="Actividad reciente">
      <div className="flex items-start justify-between gap-3">
        <div>
          <DashboardEyebrow>Movimientos</DashboardEyebrow>
          <DashboardCellTitle>Actividad reciente</DashboardCellTitle>
        </div>
        <Button size="sm" iconRight={ArrowRight01Icon} onClick={onViewAssignments}>
          Ver todas
        </Button>
      </div>

      {activities.length === 0 ? (
        <Empty
          icon={InboxIcon}
          title="Sin movimientos recientes"
          body="Aquí aparecerán las últimas asignaciones y devoluciones."
        />
      ) : (
        <div>
          {activities.map((activity) => (
            <DashboardRecentRow
              key={`${activity.type}-${activity.code}`}
              activity={activity}
              onOpen={onOpenActivity}
            />
          ))}
        </div>
      )}
    </DashboardCell>
  )
}
