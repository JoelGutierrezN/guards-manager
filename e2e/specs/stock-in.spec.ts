import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { UniqueName } from '../support/unique-name'

test('@fase-1 ingreso de 3 unidades y total reflejado en Herramientas', async ({ page }) => {
  const api = await ApiClient.login()
  const productName = UniqueName.for('Herramienta ingreso')

  try {
    const brand = await api.createBrand()
    const productModel = await api.createProductModel(brand.id)
    const product = await api.createProduct({
      brandId: brand.id,
      productModelId: productModel.id,
      name: productName,
    })

    await page.goto(`/stockIn?productId=${product.id}`)

    await expect(page.getByRole('heading', { name: 'Ingreso de inventario' })).toBeVisible()
    await expect(page.getByText(productName, { exact: true }).first()).toBeVisible()

    await page.getByLabel('Cantidad de unidades').fill('3')
    await expect(page.getByLabel('Condición de las unidades')).toHaveValue('NUEVO')

    await page.getByRole('button', { name: 'Registrar ingreso' }).click()

    const summaryHeading = page.getByRole('heading', { name: /Ingreso registrado/ })
    await expect(summaryHeading).toBeVisible()
    await expect(summaryHeading).toContainText('3 unidades')
    await expect(page.getByText(/IV-\d+ — IV-\d+/)).toBeVisible()

    await page.getByRole('button', { name: 'Ver en Herramientas' }).click()
    await expect(page).toHaveURL(/\/tools\?name=/)

    const toolRow = page.locator('tr', { hasText: productName })
    await expect(toolRow).toBeVisible()
    await expect(toolRow).toContainText('3 / 3')
  } finally {
    await api.dispose()
  }
})
