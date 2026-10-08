import { type JSX, useCallback } from 'react'
import { Avatar } from '../../../shared/infraestructure/components/ui'
import type { DashboardRecentActivity } from '../../domain/dashboard-recent-activity.model'
import { DashboardDateHelper } from '../helpers/dashboard-date.helper'
import { DashboardActivityChip } from './dashboard-activity-chip.component'

interface Props {
  activity: DashboardRecentActivity
  onOpen: (activity: DashboardRecentActivity) => void
}

export function DashboardRecentRow({ activity, onOpen }: Props): JSX.Element {
  const handleOpen = useCallback(() => onOpen(activity), [onOpen, activity])

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-hairline py-2.5 text-left transition-colors hover:bg-brand-soft"
    >
      <span className="w-20 shrink-0 font-mono text-[11px] text-muted">{activity.code}</span>
      <Avatar name={activity.employeeName} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">
          {activity.employeeName}
        </span>
        <span className="block font-mono text-[11px] text-muted">
          {activity.itemsCount} {activity.itemsCount === 1 ? 'herramienta' : 'herramientas'}
        </span>
      </span>
      <span className="hidden shrink-0 font-mono text-[11px] text-muted sm:block">
        {DashboardDateHelper.dateTime(activity.date)}
      </span>
      <DashboardActivityChip type={activity.type} />
    </button>
  )
}
