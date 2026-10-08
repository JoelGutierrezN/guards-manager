import { CustodyDateHelper } from '../../../custodies/application/custody-date.helper'

const WEEK_OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
const WEEK_WITH_YEAR_OPTIONS: Intl.DateTimeFormatOptions = { ...WEEK_OPTIONS, year: 'numeric' }
const BUSINESS_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const EMPTY_LABEL = '—'

export class DashboardDateHelper {
  static dateTime(iso: string): string {
    return CustodyDateHelper.dateTime(iso)
  }

  static weekLabel(businessDate: string): string {
    return DashboardDateHelper.format(businessDate, WEEK_OPTIONS)
  }

  static weekLongLabel(businessDate: string): string {
    return DashboardDateHelper.format(businessDate, WEEK_WITH_YEAR_OPTIONS)
  }

  /**
   * `weekStart` es una fecha de negocio (YYYY-MM-DD). Se construye en hora local a mano
   * porque `new Date('2026-06-15')` se interpreta como UTC y en México adelanta un día.
   */
  private static format(businessDate: string, options: Intl.DateTimeFormatOptions): string {
    const matched = BUSINESS_DATE_PATTERN.exec(businessDate)
    if (matched === null) return EMPTY_LABEL

    const [, year, month, day] = matched
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (Number.isNaN(date.getTime())) return EMPTY_LABEL

    return date.toLocaleDateString('es-MX', options)
  }
}
