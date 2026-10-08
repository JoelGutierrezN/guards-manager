import type { CustodyDetail } from '../domain/custody.entity'
import type { CustodyReturn } from '../domain/return.entity'
import type { SignDocument, SignDocumentItem } from '../domain/sign-document.model'
import { CustodyPresenter } from './custody-presenter.helper'

const MISSING_IDENTIFIER = '—'

/** Resguardos y devoluciones se firman con la misma pantalla: aquí se igualan sus formas. */
export class SignDocumentHelper {
  static fromCustody(custody: CustodyDetail): SignDocument {
    return {
      type: 'resguardo',
      id: custody.id,
      code: custody.code,
      custodyId: custody.id,
      custodyCode: custody.code,
      employeeId: custody.employee.id,
      employeeName: custody.employee.name,
      employeeIdentifier: custody.employee.identifier,
      itemsCount: custody.itemsCount,
      items: custody.items.map((item) => ({
        id: item.id,
        consecutive: item.stock.consecutive,
        productLabel: CustodyPresenter.productLabel(item.stock.product),
        condition: item.condition,
      })),
      notes: custody.notes,
      createdAt: custody.createdAt,
      signedAt: custody.signedAt,
      signerName: custody.signature?.signerName ?? null,
      sheet: custody.sheet,
      isCancelled: custody.status === 'CANCELADO',
    }
  }

  static fromReturn(entry: CustodyReturn): SignDocument {
    const items: SignDocumentItem[] = entry.items.map((item) => ({
      id: item.id,
      consecutive: item.stock.consecutive,
      productLabel: CustodyPresenter.productLabel(item.stock.product),
      condition: item.condition,
    }))

    return {
      type: 'devolucion',
      id: entry.id,
      code: entry.code,
      custodyId: entry.custodyId,
      custodyCode: entry.custodyCode,
      employeeId: entry.employeeId ?? entry.employee?.id ?? null,
      employeeName: entry.employee?.name ?? '',
      employeeIdentifier: entry.employee?.identifier ?? MISSING_IDENTIFIER,
      itemsCount: entry.itemsCount,
      items,
      notes: entry.notes,
      createdAt: entry.createdAt,
      signedAt: entry.signedAt,
      signerName: null,
      sheet: entry.sheet,
      isCancelled: false,
    }
  }
}
