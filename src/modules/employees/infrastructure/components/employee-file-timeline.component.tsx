import { type JSX } from 'react'
import { Clock01Icon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import type { EmployeeFileEvent } from '../../domain/employee-file-event.model'
import { EmployeeFileTimelineItem } from './employee-file-timeline-item.component'

interface Props {
  events: EmployeeFileEvent[]
}

export function EmployeeFileTimeline({ events }: Props): JSX.Element {
  if (events.length === 0) {
    return (
      <Empty
        icon={Clock01Icon}
        title="Sin historial"
        body="Todavía no hay movimientos registrados para este colaborador."
      />
    )
  }

  const lastIndex = events.length - 1

  return (
    <div className="flex flex-col">
      {events.map((event, index) => (
        <EmployeeFileTimelineItem key={event.id} event={event} last={index === lastIndex} />
      ))}
    </div>
  )
}
