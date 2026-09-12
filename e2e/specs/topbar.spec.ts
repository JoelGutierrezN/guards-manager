import { expect, test } from '@playwright/test'
import { E2eConfig } from '../support/config'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

test('@fase-7 la paleta de comandos navega a Personal con el texto buscado', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)
  const searchText = UniqueName.for('Ana')

  await page.goto('/dashboard')

  await page.keyboard.press('Control+K')
  await expect(page.getByPlaceholder(/Buscar una pantalla/)).toBeVisible()

  await page.getByPlaceholder(/Buscar una pantalla/).fill(searchText)
  await page.getByRole('button', { name: `Buscar «${searchText}» en Personal` }).click()

  await expect(page).toHaveURL(
    `${E2eConfig.webBaseUrl}/personal?q=${encodeURIComponent(searchText)}`,
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
