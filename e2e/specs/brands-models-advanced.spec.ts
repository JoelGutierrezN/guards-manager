import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { CustodyApi } from '../support/custody-api'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

test('@fase-7 eliminar una marca muestra el preview y el 409 si no puede borrarse', async ({
  page,
}) => {
  const api = await ApiClient.login()
  const custodyApi = await CustodyApi.withToken(api.token)

  const brandName = UniqueName.for('Marca bloqueada')
  const productName = UniqueName.for('Herramienta bloqueada')

  const brand = await api.createBrand(brandName)
  const productModel = await api.createProductModel(brand.id)
  const product = await api.createProduct({
    brandId: brand.id,
    productModelId: productModel.id,
    name: productName,
  })
  const role = await api.firstRole()
  const employee = await api.createEmployee({ roleId: role.id })
  const [stock] = await custodyApi.createStocks(product.id, 1)
  await custodyApi.createCustody(employee.id, [stock])

  await custodyApi.dispose()
  await api.dispose()

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/brands')
  await page.getByLabel('Buscar marca').fill(brandName)
  await page.getByRole('button', { name: `Eliminar ${brandName}` }).click()

  await expect(page.getByText(/existencias asignadas a empleados/)).toBeVisible()

  // `exact`: sin él, el nombre también casa con el botón de fila «Eliminar {marca}».
  await page.getByRole('button', { name: 'Eliminar marca', exact: true }).click()
  await expect(page.getByText('La marca no puede eliminarse.').first()).toBeVisible()

  // Chromium registra en consola cualquier recurso con estado >= 400: el 409 es la respuesta que
  // este test provoca a propósito, no un fallo de la aplicación.
  const unexpectedErrors = consoleWatcher.errors.filter(
    (entry) => !entry.includes('status of 409 (Conflict)'),
  )
  expect(unexpectedErrors).toEqual([])
})

test('@fase-7 clic en una marca navega al catálogo de modelos filtrado', async ({ page }) => {
  const api = await ApiClient.login()
  const brandName = UniqueName.for('Marca navegable')
  const brand = await api.createBrand(brandName)
  await api.dispose()

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/brands')
  await page.getByLabel('Buscar marca').fill(brandName)
  await page.getByRole('button', { name: `Abrir marca ${brandName}` }).click()

  await expect(page).toHaveURL(new RegExp(`/models\\?brand=${brand.id}`))
  await expect(page.getByRole('button', { name: new RegExp(brandName) })).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})
