import { type JSX, useMemo } from 'react'
import { Icon } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import { EmployeeFilePresenter } from '../../application/employee-file-presenter.helper'
import type { EmployeeFileEvent } from '../../domain/employee-file-event.model'
import { EMPLOYEE_FILE_TIMELINE_TONES } from './employee-file-timeline-tone.model'

interface Props {
  event: EmployeeFileEvent
  last: boolean
}

const BASE_DOT_CLASS_NAME =
  'z-[2] row-start-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px]'

export function EmployeeFileTimelineItem({ event, last }: Props): JSX.Element {
  const { icon, className: toneClassName } = EMPLOYEE_FILE_TIMELINE_TONES[event.type]

  const rowClassName = useMemo(
    () => cn('relative grid grid-cols-[28px_1fr] gap-x-3', last ? 'pb-0' : 'pb-4'),
    [last],
  )

  const dotClassName = useMemo(() => cn(BASE_DOT_CLASS_NAME, toneClassName), [toneClassName])

  return (
    <div className={rowClassName}>
      <span className={dotClassName}>
        <Icon icon={icon} size={10} />
      </span>
      {!last && (
        <span className="absolute top-6 bottom-0 left-[11.5px] z-[1] w-px bg-hairline-strong" />
      )}
      <div className="row-start-1 rounded-[14px] border border-hairline bg-paper-tint px-3 py-2 text-[12px] text-ink-2">
        <div className="flex items-center justify-between gap-2">
          <b className="text-[13px] text-ink">{event.title}</b>
          <span className="shrink-0 font-mono text-[11px] text-muted">
            {EmployeeFilePresenter.eventTimestamp(event)}
          </span>
        </div>
        <div className="text-[11px] text-muted">{event.body}</div>
      </div>
    </div>
  )
}
