export class DashboardRouteHelper {
  static pathForId(itemId: string): string {
    return itemId === 'dashboard' ? '/dashboard' : `/dashboard/${itemId}`
  }

  static activeIdFromPath(pathname: string): string {
    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'dashboard'
    const segment = pathname.split('/dashboard/')[1]
    return segment ?? 'dashboard'
  }
}
