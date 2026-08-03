import type { ChipTone } from '../ui'

//Data de prueba para la vializacion del diseño xd
export interface FeatureDef {
  title: string
  body: string
}

export const FEATURES: FeatureDef[] = [
  {
    title: 'Asignaciones más rápidas',
    body: 'De solicitud a firma digital en menos de 90 segundos. Reduce el tiempo de entrega 4×.',
  },
  {
    title: 'Trazabilidad total',
    body: 'Cada herramienta tiene un historial completo: dónde está, quién la usa y cuándo regresa.',
  },
  {
    title: 'Confianza operativa',
    body: 'Alertas tempranas de extravío, devoluciones vencidas y mantenimiento programado.',
  },
]

export type KpiKey = 'open' | 'avail' | 'mtto'

export const CHART_HEADINGS: Record<KpiKey, { eyebrow: string; title: string }> = {
  open: { eyebrow: 'Actividad', title: 'Asignaciones vs devoluciones' },
  avail: { eyebrow: 'Disponibilidad', title: 'Stock disponible vs solicitado' },
  mtto: { eyebrow: 'Mantenimiento', title: 'Entradas y salidas de mantenimiento' },
}

export type AssignmentStatus = 'abierta' | 'parcial' | 'vencida' | 'cerrada'

export interface RecentAssignment {
  id: string
  name: string
  code: string
  count: number
  when: string
  status: AssignmentStatus
}

export const RECENT_ASSIGNMENTS: RecentAssignment[] = [
  {
    id: 'AS-0142',
    name: 'Hugo Salazar M.',
    code: 'ETT-0418',
    count: 2,
    when: 'hoy 10:14',
    status: 'abierta',
  },
  {
    id: 'AS-0141',
    name: 'Rocío Pacheco',
    code: 'ETT-0203',
    count: 1,
    when: 'hoy 09:02',
    status: 'abierta',
  },
  {
    id: 'AS-0140',
    name: 'Jorge Treviño',
    code: 'ETT-0511',
    count: 4,
    when: 'ayer 16:33',
    status: 'parcial',
  },
  {
    id: 'AS-0139',
    name: 'Marcos Lara',
    code: 'ETT-0399',
    count: 1,
    when: 'ayer 11:20',
    status: 'vencida',
  },
]

export const STATUS_TONE: Record<AssignmentStatus, ChipTone> = {
  abierta: 'navy',
  parcial: 'warn',
  vencida: 'danger',
  cerrada: 'ok',
}
