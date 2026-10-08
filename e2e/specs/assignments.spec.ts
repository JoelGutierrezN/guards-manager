import { expect, test } from '@playwright/test'

const CUSTODY_CODE_PATTERN = /^AS-\d+$/

test('@fase-2 listado de resguardos, filtro por folio y detalle', async ({ page }) => {
  await page.goto('/assignments')

  await expect(page.getByRole('heading', { name: 'Resguardos activos' })).toBeVisible()

  const codeCells = page.locator('tbody td').filter({ hasText: CUSTODY_CODE_PATTERN })
  await expect(codeCells.first()).toBeVisible()
  const custodyCode = (await codeCells.first().innerText()).trim()

  await page.getByLabel('Buscar resguardos').fill(custodyCode)
  await expect(page).toHaveURL(new RegExp(`q=${custodyCode}`))
  await expect(codeCells).toHaveCount(1)

  await page.locator('tbody tr', { hasText: custodyCode }).first().click()

  await expect(page).toHaveURL(/\/assignments\/[^/]+$/)
  await expect(page.getByRole('heading', { name: `Resguardo ${custodyCode}` })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Herramientas en resguardo' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Historial de devoluciones' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver expediente' })).toBeVisible()

  await expect(page.getByRole('banner').getByText(custodyCode)).toBeVisible()

  await page.getByRole('button', { name: 'Volver a Resguardos' }).click()
  await expect(page).toHaveURL(/\/assignments(\?|$)/)
})
