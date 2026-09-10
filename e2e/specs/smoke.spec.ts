import { expect, test } from '@playwright/test'
import { ApiTraffic } from '../support/api-traffic'
import { E2eConfig } from '../support/config'
import { ConsoleWatcher } from '../support/console-watcher'
import { SIDEBAR_ROUTES } from '../support/sidebar-routes'

test.use({ storageState: { cookies: [], origins: [] } })

test('@fase-0 inicio de sesión, recorrido del menú y cierre de sesión', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)
  const apiTraffic = ApiTraffic.watch(page)

  await page.goto('/')
  await page.getByLabel('Usuario').fill(E2eConfig.demoIdentifier)
  await page.getByLabel('Contraseña').fill(E2eConfig.demoPassword)
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click()

  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/dashboard`)

  const sidebarNav = page.getByRole('navigation')

  for (const route of SIDEBAR_ROUTES) {
    await sidebarNav.getByRole('button', { name: route.label, exact: true }).click()
    await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}${route.path}`)
    await expect(page.locator('main')).toBeVisible()
    await apiTraffic.settle()
  }

  await page.getByRole('button', { name: 'Cerrar sesión' }).click()

  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/`)
  await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible()
  await apiTraffic.settle()

  expect(consoleWatcher.errors).toEqual([])
})
