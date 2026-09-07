import { SentIcon, Tick02Icon, UserIcon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import type { EmployeeFileEventType } from '../../domain/employee-file-event.model'

export interface EmployeeFileTimelineTone {
  icon: IconSvgElement
  className: string
}

export const EMPLOYEE_FILE_TIMELINE_TONES: Record<EmployeeFileEventType, EmployeeFileTimelineTone> =
  {
    asignacion: { icon: SentIcon, className: 'border-brand bg-brand text-cream' },
    devolucion: { icon: Tick02Icon, className: 'border-ok bg-ok text-cream' },
    alta: { icon: UserIcon, className: 'border-hairline-strong bg-white text-ink-2' },
  }
