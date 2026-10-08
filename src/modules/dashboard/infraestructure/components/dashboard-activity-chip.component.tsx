import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import { DashboardActivityTypeHelper } from '../../application/dashboard-activity-type.helper'
import type { DashboardActivityType } from '../../domain/dashboard-activity-type.model'

interface Props {
  type: DashboardActivityType
}

export function DashboardActivityChip({ type }: Props): JSX.Element {
  return (
    <Chip tone={DashboardActivityTypeHelper.tone(type)} size="sm" dot>
      {DashboardActivityTypeHelper.label(type)}
    </Chip>
  )
}
