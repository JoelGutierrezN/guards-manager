import type { ChipTone } from '../../shared/infraestructure/components/ui'

export const CUSTODY_RETURN_TYPES = ['TOTAL', 'PARCIAL'] as const

export type CustodyReturnType = (typeof CUSTODY_RETURN_TYPES)[number]

export interface CustodyReturnTypeDescriptor {
  value: CustodyReturnType
  label: string
  tone: ChipTone
}

export const CUSTODY_RETURN_TYPE_MAP: Record<CustodyReturnType, CustodyReturnTypeDescriptor> = {
  TOTAL: { value: 'TOTAL', label: 'Devolución total', tone: 'ok' },
  PARCIAL: { value: 'PARCIAL', label: 'Devolución parcial', tone: 'warn' },
}
