const CUSTODIES_PATH = '/assignments'
const EMPLOYEES_PATH = '/personal'
const DOCUMENTS_TAB = 'docs'

export class SignNavigationHelper {
  static custodySignPath(custodyId: string): string {
    return `${CUSTODIES_PATH}/${custodyId}/sign`
  }

  static returnSignPath(custodyId: string, returnId: string): string {
    return `${CUSTODIES_PATH}/${custodyId}/returns/${returnId}/sign`
  }

  static custodyPath(custodyId: string): string {
    return `${CUSTODIES_PATH}/${custodyId}`
  }

  static custodiesPath(): string {
    return CUSTODIES_PATH
  }

  /** El expediente abre directo en la pestaña Documentos (F4-W2 la sincroniza con `?tab=`). */
  static employeeDocumentsPath(employeeId: string): string {
    const query = new URLSearchParams({ tab: DOCUMENTS_TAB })
    return `${EMPLOYEES_PATH}/${employeeId}?${query.toString()}`
  }
}
