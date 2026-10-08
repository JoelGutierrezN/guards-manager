import { expect, test, type Locator } from '@playwright/test'
import { ApiTraffic } from '../support/api-traffic'
import { ConsoleWatcher } from '../support/console-watcher'

const POSITIVE_NUMBER_PATTERN = /^[1-9][\d,]*$/

const readMetric = (scope: Locator, label: string): Locator =>
  scope.getByRole('article', { name: label }).getByText(POSITIVE_NUMBER_PATTERN).first()

test('@fase-7 el panel carga con cifras reales del seed demo', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)
  const apiTraffic = ApiTraffic.watch(page)

  await page.goto('/dashboard')

  await expect(page.getByRole('heading', { name: /Panel general de operación/ })).toBeVisible()
  await apiTraffic.settle()

  await expect(readMetric(page.locator('main'), 'Herramientas totales')).toBeVisible()
  await expect(readMetric(page.locator('main'), 'Disponibles')).toBeVisible()
  await expect(readMetric(page.locator('main'), 'Empleados activos')).toBeVisible()

  const activityCell = page.getByRole('article', { name: 'Actividad semanal' })
  await expect(activityCell.getByRole('img', { name: /Asignaciones y devoluciones/ })).toBeVisible()

  const recentCell = page.getByRole('article', { name: 'Actividad reciente' })
  await expect(
    recentCell
      .getByRole('button')
      .filter({ hasText: /AS-|DEV-/ })
      .first(),
  ).toBeVisible()

  await recentCell.getByRole('button', { name: 'Ver todas' }).click()
  await expect(page).toHaveURL(/\/assignments(\?|$)/)
  await apiTraffic.settle()

  expect(consoleWatcher.errors).toEqual([])
})
