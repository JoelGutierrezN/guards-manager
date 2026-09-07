export class AppRouteHelper {
  static pathForId(itemId: string): string {
    return `/${itemId}`
  }

  /** Sección de navegación activa: el detalle de un recurso sigue perteneciendo a su sección. */
  static navIdFromPath(pathname: string): string {
    const [section] = pathname.split('/').filter(Boolean)
    return section ?? 'dashboard'
  }
}
