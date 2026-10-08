import { SheetFilenameHelper } from '../../../shared/application/sheet-filename.helper'
import type { CustodySheet } from '../../domain/custody.entity'
import type { SheetTarget } from '../../domain/sheet-target.model'
import type { SignDocumentType } from '../../domain/sign-document.model'

/**
 * Sin firma el API no persiste hoja y `sheet` llega en `null`: la descarga del borrador usa
 * la misma ruta (`/custodies/{id}/sheet`) y el nombre de archivo derivado del folio (2.2).
 */
export class SheetPathHelper {
  static custodyTarget(custodyId: string, code: string, sheet: CustodySheet | null): SheetTarget {
    return SheetPathHelper.target(`/custodies/${custodyId}/sheet`, 'resguardo', code, sheet)
  }

  static returnTarget(returnId: string, code: string, sheet: CustodySheet | null): SheetTarget {
    return SheetPathHelper.target(`/returns/${returnId}/sheet`, 'devolucion', code, sheet)
  }

  private static target(
    fallbackUrl: string,
    type: SignDocumentType,
    code: string,
    sheet: CustodySheet | null,
  ): SheetTarget {
    const url = sheet !== null && sheet.url !== '' ? sheet.url : fallbackUrl
    const filename =
      sheet !== null && sheet.filename !== ''
        ? sheet.filename
        : SheetFilenameHelper.filename(type, code)
    return { url, filename }
  }
}
