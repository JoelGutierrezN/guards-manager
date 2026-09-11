import type { SignDocument, SignDocumentType } from '../domain/sign-document.model'
import { CustodyDateHelper } from './custody-date.helper'
import { CustodyPresenter } from './custody-presenter.helper'

const TYPE_LABEL: Record<SignDocumentType, string> = {
  resguardo: 'Resguardo',
  devolucion: 'Devolución',
}

const TITLE_NOUN: Record<SignDocumentType, string> = {
  resguardo: 'del resguardo',
  devolucion: 'de la devolución',
}

export class SignPresenter {
  static typeLabel(type: SignDocumentType): string {
    return TYPE_LABEL[type]
  }

  static heroTitle(signDocument: SignDocument): string {
    return `Firma ${TITLE_NOUN[signDocument.type]} ${signDocument.code}`
  }

  static heroLede(signDocument: SignDocument): string {
    const units = CustodyPresenter.quantityText(signDocument.itemsCount, 'unidad', 'unidades')
    const employee = signDocument.employeeName === '' ? 'el empleado' : signDocument.employeeName
    return `${employee} confirma ${units} en la hoja ${signDocument.code}. Al firmar se genera el PDF definitivo.`
  }

  static signedNotice(signDocument: SignDocument): string {
    const signer = signDocument.signerName === null ? '' : ` por ${signDocument.signerName}`
    return `Esta hoja se firmó${signer} el ${CustodyDateHelper.dateTime(signDocument.signedAt)}.`
  }

  static documentSummary(signDocument: SignDocument): string {
    const units = CustodyPresenter.quantityText(signDocument.itemsCount, 'unidad', 'unidades')
    return `${units} · registrado el ${CustodyDateHelper.dateTime(signDocument.createdAt)}`
  }
}
