import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { ConsoleWatcher } from '../support/console-watcher'
import { CustodyApi } from '../support/custody-api'
import { UniqueName } from '../support/unique-name'

const SIGNATURE_CANVAS_LABEL = 'Área de firma'

test('@fase-4 firma la hoja de un resguardo y descarga el PDF', async ({ page }) => {
  const api = await ApiClient.login()
  const custodyApi = await CustodyApi.withToken(api.token)

  const productName = UniqueName.for('Herramienta firma')
  const employeeName = UniqueName.for('Empleado firma')

  const brand = await api.createBrand()
  const productModel = await api.createProductModel(brand.id)
  const product = await api.createProduct({
    brandId: brand.id,
    productModelId: productModel.id,
    name: productName,
  })
  const role = await api.firstRole()
  const employee = await api.createEmployee({ roleId: role.id, name: employeeName })
  const stocks = await custodyApi.createStocks(product.id, 2)
  const custody = await custodyApi.createCustody(employee.id, stocks)
  await custodyApi.dispose()
  await api.dispose()

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto(`/assignments/${custody.id}`)
  await expect(page.getByRole('heading', { name: `Resguardo ${custody.code}` })).toBeVisible()
  await expect(page.getByText('Pendiente de firma').first()).toBeVisible()

  await page.getByRole('button', { name: 'Firmar resguardo' }).click()
  await expect(page).toHaveURL(new RegExp(`/assignments/${custody.id}/sign$`))
  await expect(
    page.getByRole('heading', { name: `Firma del resguardo ${custody.code}` }),
  ).toBeVisible()
  await expect(page.getByLabel('Nombre de quien firma')).toHaveValue(employeeName)

  const canvas = page.getByRole('img', { name: SIGNATURE_CANVAS_LABEL })
  const bounds = await canvas.boundingBox()
  expect(bounds).not.toBeNull()
  if (bounds === null) return

  await page.mouse.move(bounds.x + 40, bounds.y + 120)
  await page.mouse.down()
  await page.mouse.move(bounds.x + 110, bounds.y + 50, { steps: 12 })
  await page.mouse.move(bounds.x + 190, bounds.y + 140, { steps: 12 })
  await page.mouse.move(bounds.x + 260, bounds.y + 60, { steps: 12 })
  await page.mouse.up()

  await page.getByRole('button', { name: 'Firmar y generar hoja' }).click()

  await expect(page.getByRole('heading', { name: 'Hoja firmada' })).toBeVisible()

  const [sheetResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().includes(`/custodies/${custody.id}/sheet`)),
    page.getByRole('button', { name: 'Descargar hoja' }).click(),
  ])
  expect(sheetResponse.status()).toBe(200)
  expect(sheetResponse.headers()['content-type']).toContain('application/pdf')

  await page.getByRole('button', { name: 'Ver documento en expediente' }).click()
  await expect(page).toHaveURL(new RegExp(`/personal/${employee.id}[?]tab=docs$`))
  await expect(page.getByRole('heading', { name: employeeName })).toBeVisible()

  await expect(page.getByText(`Resguardo ${custody.code}`).first()).toBeVisible()

  const [documentResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().includes(`/custodies/${custody.id}/sheet`)),
    page.getByRole('button', { name: 'Descargar', exact: true }).click(),
  ])
  expect(documentResponse.status()).toBe(200)
  expect(documentResponse.headers()['content-type']).toContain('application/pdf')

  await page.goto(`/assignments/${custody.id}`)
  await expect(page.getByRole('heading', { name: `Resguardo ${custody.code}` })).toBeVisible()
  await expect(page.getByText('Pendiente de firma')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Firmar resguardo' })).toHaveCount(0)

  expect(consoleWatcher.errors).toEqual([])
})
