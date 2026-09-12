import { expect, test } from '@playwright/test'
import { ApiTraffic } from '../support/api-traffic'
import { E2eConfig } from '../support/config'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

test('@fase-7 la paleta de comandos navega a Personal con el texto buscado', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)
  const apiTraffic = ApiTraffic.watch(page)
  const searchText = UniqueName.for('Ana')

  await page.goto('/dashboard')
  // El atajo se registra en un `useEffect`: pulsado antes de que monte la pantalla, se pierde.
  await apiTraffic.settle()

  await page.keyboard.press('Control+K')
  // El modal nunca se desmonta, así que `toBeVisible` también pasaría con la paleta cerrada.
  await expect(page.getByPlaceholder(/Buscar una pantalla/)).toBeFocused()

  await page.getByPlaceholder(/Buscar una pantalla/).fill(searchText)
  await page.getByRole('button', { name: `Buscar «${searchText}» en Personal` }).click()

  // La pantalla reescribe la query con `URLSearchParams`, que codifica el espacio como «+».
  await expect(page).toHaveURL(
    (url) =>
      url.origin === E2eConfig.webBaseUrl &&
      url.pathname === '/personal' &&
      url.searchParams.get('q') === searchText,
  )
  await expect(page.locator('main')).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})

test('@fase-7 la bandeja de notificaciones abre el panel real', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/dashboard')

  await page.getByRole('button', { name: 'Notificaciones' }).click()
  await expect(page.getByRole('dialog', { name: 'Notificaciones' })).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})
