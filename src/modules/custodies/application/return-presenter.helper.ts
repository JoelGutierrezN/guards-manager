import {
  CUSTODY_RETURN_TYPE_MAP,
  type CustodyReturnType,
} from '../domain/custody-return-type.model'
import type { CustodyReturn } from '../domain/return.entity'
import { CustodyPresenter } from './custody-presenter.helper'

export class ReturnPresenter {
  static typeLabel(type: CustodyReturnType): string {
    return CUSTODY_RETURN_TYPE_MAP[type].label
  }

  static heroLede(custodyCode: string, pendingCount: number): string {
    const pending = CustodyPresenter.quantityText(
      pendingCount,
      'unidad pendiente',
      'unidades pendientes',
    )
    return `Marca las unidades que regresan del resguardo ${custodyCode}. Quedan ${pending} de devolución.`
  }

  static previewText(selectedCount: number, pendingCount: number): string {
    const pending = pendingCount === 1 ? 'unidad pendiente' : 'unidades pendientes'
    return `Seleccionadas ${selectedCount} de ${pendingCount} ${pending}.`
  }

  static successSummary(createdReturn: CustodyReturn): string {
    const items = CustodyPresenter.quantityText(
      createdReturn.itemsCount,
      'unidad devuelta',
      'unidades devueltas',
    )
    const employeeName = createdReturn.employee?.name ?? 'el empleado'
    const custody =
      createdReturn.custodyCode === '' ? '' : ` del resguardo ${createdReturn.custodyCode}`
    return `${items} por ${employeeName}${custody}.`
  }
}
