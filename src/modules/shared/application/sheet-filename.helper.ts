export type SheetDocumentType = 'resguardo' | 'devolucion'

const FILENAME_PREFIX: Record<SheetDocumentType, string> = {
  resguardo: 'resguardo',
  devolucion: 'devolucion',
}

/** Único constructor de nombres de hoja PDF del proyecto (2.2 · Folios): la misma hoja se
 *  guarda como `resguardo-AS-00001.pdf` o `devolucion-DEV-0001.pdf` se descargue desde la
 *  pantalla de firma, desde el detalle del resguardo o desde la pestaña Documentos. */
export class SheetFilenameHelper {
  static filename(type: SheetDocumentType, code: string): string {
    return `${FILENAME_PREFIX[type]}-${code}.pdf`
  }
}
