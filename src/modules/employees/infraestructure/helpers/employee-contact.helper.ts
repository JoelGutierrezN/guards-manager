const MEXICO_COUNTRY_CODE = '52'
const LOCAL_PHONE_DIGITS = 10

export class EmployeeContactHelper {
  static mailtoUrl(email: string): string {
    return `mailto:${email}`
  }

  static whatsappUrl(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    const international =
      digits.length === LOCAL_PHONE_DIGITS ? `${MEXICO_COUNTRY_CODE}${digits}` : digits
    return `https://wa.me/${international}`
  }
}
