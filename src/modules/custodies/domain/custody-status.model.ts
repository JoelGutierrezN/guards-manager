import type { ChipTone, FilterStateOptionItem } from '../../shared/infraestructure/components/ui'

export const CUSTODY_STATUSES = [
  'ACTIVO',
  'PARCIALMENTE DEVUELTO',
  'DEVUELTO',
  'CANCELADO',
] as const

export type CustodyStatus = (typeof CUSTODY_STATUSES)[number]

export interface CustodyStatusDescriptor {
  value: CustodyStatus
  label: string
  tone: ChipTone
}

export const CUSTODY_STATUS_MAP: Record<CustodyStatus, CustodyStatusDescriptor> = {
  ACTIVO: { value: 'ACTIVO', label: 'Activo', tone: 'navy' },
  'PARCIALMENTE DEVUELTO': {
    value: 'PARCIALMENTE DEVUELTO',
    label: 'Parcialmente devuelto',
    tone: 'warn',
  },
  DEVUELTO: { value: 'DEVUELTO', label: 'Devuelto', tone: 'ok' },
  CANCELADO: { value: 'CANCELADO', label: 'Cancelado', tone: 'default' },
}

export const CUSTODY_STATUS_OPTIONS: FilterStateOptionItem<CustodyStatus>[] = CUSTODY_STATUSES.map(
  (status) => ({ value: status, label: CUSTODY_STATUS_MAP[status].label }),
)
