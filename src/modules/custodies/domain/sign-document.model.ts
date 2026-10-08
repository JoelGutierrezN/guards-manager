import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { CustodySheet } from './custody.entity'

export type SignDocumentType = 'resguardo' | 'devolucion'

export interface SignDocumentItem {
  id: string
  consecutive: string
  productLabel: string
  condition: ItemCondition
}

/**
 * Vista común de un resguardo y de una devolución para la pantalla de firma: ambas hojas
 * se firman igual y sólo cambian el folio, el origen y el conjunto de unidades.
 */
export interface SignDocument {
  type: SignDocumentType
  id: string
  code: string
  custodyId: string
  custodyCode: string
  employeeId: string | null
  employeeName: string
  employeeIdentifier: string
  itemsCount: number
  items: SignDocumentItem[]
  notes: string | null
  createdAt: string
  signedAt: string | null
  signerName: string | null
  sheet: CustodySheet | null
  isCancelled: boolean
}
