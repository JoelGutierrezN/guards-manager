export class AppRouteHelper {
  static pathForId(itemId: string): string {
    return `/${itemId}`
  }

  static activeIdFromPath(pathname: string): string {
    const segment = pathname.split('/')[1]
    return segment || 'dashboard'
  }
}
