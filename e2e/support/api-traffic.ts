import type { Page, Request } from '@playwright/test'
import { E2eConfig } from './config'

const QUIET_WINDOW_MS = 400
const SETTLE_TIMEOUT_MS = 20_000
const POLL_INTERVAL_MS = 50

/**
 * `page.waitForLoadState('networkidle')` no sirve tras una navegación de cliente: el documento ya
 * alcanzó ese estado durante la carga inicial y la espera regresa al instante. Este vigilante cuenta
 * las peticiones al API que siguen vivas para poder esperar a que la pantalla termine de cargar de
 * verdad, y así nadie cierra sesión con peticiones en vuelo (el token se revoca y responden 401).
 */
export class ApiTraffic {
  private inFlight = 0
  private lastActivityAt = Date.now()

  static watch(page: Page): ApiTraffic {
    const traffic = new ApiTraffic()

    page.on('request', (request) => traffic.onStart(request))
    page.on('requestfinished', (request) => traffic.onEnd(request))
    page.on('requestfailed', (request) => traffic.onEnd(request))

    return traffic
  }

  /** Espera a que no quede ninguna petición al API viva durante una ventana de calma. */
  async settle(): Promise<void> {
    const deadline = Date.now() + SETTLE_TIMEOUT_MS

    while (Date.now() < deadline) {
      if (this.isQuiet()) return
      await ApiTraffic.pause()
    }

    throw new Error(
      `El API siguió ocupado tras ${SETTLE_TIMEOUT_MS} ms (${this.inFlight} peticiones en vuelo).`,
    )
  }

  private isQuiet(): boolean {
    return this.inFlight === 0 && Date.now() - this.lastActivityAt >= QUIET_WINDOW_MS
  }

  private onStart(request: Request): void {
    if (!ApiTraffic.isApiCall(request)) return
    this.inFlight += 1
    this.lastActivityAt = Date.now()
  }

  private onEnd(request: Request): void {
    if (!ApiTraffic.isApiCall(request)) return
    this.inFlight = Math.max(0, this.inFlight - 1)
    this.lastActivityAt = Date.now()
  }

  private static isApiCall(request: Request): boolean {
    return request.url().startsWith(E2eConfig.apiBaseUrl)
  }

  private static pause(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, POLL_INTERVAL_MS)
    })
  }
}
