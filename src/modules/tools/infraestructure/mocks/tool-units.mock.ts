// TODO API: las unidades por herramienta (disponibles/asignadas/inutilizables) vienen de
//           GET /api/tools/{id}/units. Este generador sembrado es solo mock; borrar al integrar.
import type { Tool } from '../../domain/tool.entity'
import type {
  ToolUnits,
  ToolUnit,
  AssignedToolUnit,
  InutilToolUnit,
} from '../../domain/tool-unit.model'
import { INUTIL_STATES } from '../../domain/tool-unit.model'

const STOCK_ASSIGNEES = [
  'Carlos Mendoza',
  'Ana Restrepo',
  'Luis Fernández',
  'María Gómez',
  'Jorge Patiño',
  'Sofía Lara',
  'Diego Cruz',
  'Valentina Ruiz',
  'Andrés Vélez',
  'Camila Torres',
  'Felipe Soto',
  'Daniela Quintero',
]

const STOCK_MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
]

function createSeededRandom(seed: number): () => number {
  let state = (seed * 9301 + 49297) % 233280
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

export class ToolUnitsMock {
  static build(tool: Tool): ToolUnits {
    const idSeed = [...tool.id].reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
    const random = createSeededRandom(idSeed * 17 + 3)
    const abbreviation =
      tool.model
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6) || 'STK'
    let sequence = 1 + Math.floor(random() * 40)

    const nextSerial = () => `SN-${abbreviation}-${String(sequence++).padStart(4, '0')}`
    const nextDate = () => {
      const year = random() < 0.45 ? 2025 : 2026
      const month = Math.floor(random() * 12)
      const day = 1 + Math.floor(random() * 27)
      return `${day} ${STOCK_MONTHS[month]} ${year}`
    }
    const baseUnit = (): ToolUnit => ({
      serial: nextSerial(),
      name: tool.name,
      brand: tool.brand,
      model: tool.model,
    })

    const remaining = Math.max(0, tool.total - tool.assigned)
    const inutilCount = Math.min(Math.floor(random() * 2.4), remaining)
    const dispCount = Math.max(0, remaining - inutilCount)

    const disponibles: ToolUnit[] = Array.from({ length: dispCount }, () => baseUnit())
    const asignadas: AssignedToolUnit[] = Array.from({ length: tool.assigned }, () => ({
      ...baseUnit(),
      assignee: STOCK_ASSIGNEES[Math.floor(random() * STOCK_ASSIGNEES.length)],
      since: nextDate(),
    }))
    const inutilizables: InutilToolUnit[] = Array.from({ length: inutilCount }, () => ({
      ...baseUnit(),
      state: INUTIL_STATES[Math.floor(random() * INUTIL_STATES.length)],
    }))

    return { disponibles, asignadas, inutilizables }
  }
}
