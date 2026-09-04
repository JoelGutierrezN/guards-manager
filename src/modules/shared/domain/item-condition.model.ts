export const ITEM_CONDITIONS = [
  'NUEVO',
  'BUENO',
  'REGULAR',
  'DAÑADO',
  'PERDIDO',
  'ROTO',
  'BAJA',
] as const

export type ItemCondition = (typeof ITEM_CONDITIONS)[number]

export type ItemConditionTone = 'ok' | 'warn' | 'danger'

export interface ItemConditionDescriptor {
  value: ItemCondition
  label: string
  tone: ItemConditionTone
}

export const ITEM_CONDITION_MAP: Record<ItemCondition, ItemConditionDescriptor> = {
  NUEVO: { value: 'NUEVO', label: 'Nuevo', tone: 'ok' },
  BUENO: { value: 'BUENO', label: 'Bueno', tone: 'ok' },
  REGULAR: { value: 'REGULAR', label: 'Regular', tone: 'warn' },
  DAÑADO: { value: 'DAÑADO', label: 'Dañado', tone: 'danger' },
  PERDIDO: { value: 'PERDIDO', label: 'Perdido', tone: 'danger' },
  ROTO: { value: 'ROTO', label: 'Roto', tone: 'danger' },
  BAJA: { value: 'BAJA', label: 'Baja', tone: 'danger' },
}

export const BAD_CONDITIONS: readonly ItemCondition[] = ['DAÑADO', 'PERDIDO', 'ROTO', 'BAJA']

export const DEFAULT_ITEM_CONDITION: ItemCondition = 'NUEVO'
