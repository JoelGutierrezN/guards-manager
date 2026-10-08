const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTIONS,
  hour: '2-digit',
  minute: '2-digit',
}

const EMPTY_LABEL = '—'

export class CustodyDateHelper {
  static date(iso: string | null): string {
    return CustodyDateHelper.format(iso, DATE_OPTIONS)
  }

  static dateTime(iso: string | null): string {
    return CustodyDateHelper.format(iso, DATE_TIME_OPTIONS)
  }

  private static format(iso: string | null, options: Intl.DateTimeFormatOptions): string {
    if (iso == null || iso === '') return EMPTY_LABEL
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return EMPTY_LABEL
    return date.toLocaleDateString('es-MX', options)
  }
}
