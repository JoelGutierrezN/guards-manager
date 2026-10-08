import {
  Alert02Icon,
  Cancel01Icon,
  SentIcon,
  Tick02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import type {
  EmployeeFileEventTone,
  EmployeeFileEventType,
} from '../../domain/employee-file-event.model'

export const EMPLOYEE_FILE_TIMELINE_ICONS: Record<EmployeeFileEventType, IconSvgElement> = {
  asignacion: SentIcon,
  devolucion: Tick02Icon,
  alta: UserIcon,
  daño: Alert02Icon,
  cancelacion: Cancel01Icon,
}

export const EMPLOYEE_FILE_TIMELINE_TONE_CLASS_NAMES: Record<EmployeeFileEventTone, string> = {
  neutral: 'border-hairline-strong bg-white text-ink-2',
  ok: 'border-ok bg-ok text-cream',
  warn: 'border-warn bg-warn text-cream',
}
