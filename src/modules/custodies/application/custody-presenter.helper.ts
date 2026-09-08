import { CUSTODY_STATUS_MAP, type CustodyStatus } from '../domain/custody-status.model'
import type { Custody, CustodyItem } from '../domain/custody.entity'
import { CustodyDateHelper } from '../infraestructure/helpers/custody-date.helper'

export class CustodyPresenter {
  static statusLabel(status: CustodyStatus): string {
    return CUSTODY_STATUS_MAP[status].label
  }

  static heroTitle(code: string): string {
    return `Resguardo ${code}`
  }

  static heroLede(custody: Custody): string {
    const items = CustodyPresenter.quantityText(custody.itemsCount, 'herramienta', 'herramientas')
    const pending =
      custody.pendingItemsCount === 0
        ? 'sin unidades pendientes de devolución'
        : `${CustodyPresenter.quantityText(custody.pendingItemsCount, 'unidad pendiente', 'unidades pendientes')} de devolución`
    const author = custody.createdBy == null ? '' : ` por ${custody.createdBy.name}`
    return `${items} en resguardo, ${pending}. Registrado el ${CustodyDateHelper.date(custody.createdAt)}${author}.`
  }

  static itemProductLabel(item: CustodyItem): string {
    const { product } = item.stock
    const details = [product.brand, product.model].filter(
      (detail): detail is string => detail != null && detail !== '',
    )
    return details.length === 0 ? product.name : `${product.name} · ${details.join(' ')}`
  }

  static canBeCancelled(custody: Custody): boolean {
    return custody.status === 'ACTIVO'
  }

  static quantityText(quantity: number, singular: string, plural: string): string {
    return `${quantity} ${quantity === 1 ? singular : plural}`
  }
}
