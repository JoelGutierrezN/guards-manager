const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}

export class StockUnitDateHelper {
  static format(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('es-MX', DATE_FORMAT_OPTIONS)
  }
}
