const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}

const EMPTY_LABEL = '—'

export class UserDateHelper {
  static date(iso: string | null): string {
    if (iso == null || iso === '') return EMPTY_LABEL
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return EMPTY_LABEL
    return date.toLocaleDateString('es-MX', DATE_OPTIONS)
  }
}
