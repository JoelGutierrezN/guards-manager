import type { Pagination } from '../../shared/domain/pagination.model'
import type { ToolUnit } from './tool-unit.model'

export interface SerialCorrection {
  id: string
  previousSerial: string | null
  newSerial: string
  reason: string | null
  createdAt: string
  createdBy: { id: string; name: string }
  custody: { id: string; code: string } | null
  responsible: { id: string; identifier: string; name: string } | null
  receipt: { id: string; filename: string; url: string; sizeBytes: number } | null
}

export interface SerialCorrectionsPage extends Pagination {
  corrections: SerialCorrection[]
}

export interface SerialCorrectionInput {
  serial: string
  expectedSerial: string | null
  reason: string
}

export interface SerialCorrectionResult {
  stock: ToolUnit
  correction: SerialCorrection
}

export interface SerialCorrectionErrors {
  message: string | null
  serial?: string
  reason?: string
  currentSerial?: string | null
  stale: boolean
}
