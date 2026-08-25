const DETAIL_CRUMB_IDS: Record<string, string> = {
  personal: 'employeeFile',
}

export class AppRouteHelper {
  static pathForId(itemId: string): string {
    return `/${itemId}`
  }

  /** Sección de navegación activa: el detalle de un recurso sigue perteneciendo a su sección. */
  static navIdFromPath(pathname: string): string {
    const [section] = pathname.split('/').filter(Boolean)
    return section ?? 'dashboard'
  }

  /** Identificador de migas: los detalles tienen su propia ruta de migas. */
  static crumbIdFromPath(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean)
    const [section] = segments
    if (section == null) return 'dashboard'
    if (segments.length === 1) return section
    return DETAIL_CRUMB_IDS[section] ?? section
  }
}
