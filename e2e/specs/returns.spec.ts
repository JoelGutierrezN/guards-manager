import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { ConsoleWatcher } from '../support/console-watcher'
import { CustodyApi } from '../support/custody-api'
import { UniqueName } from '../support/unique-name'

const RETURN_CODE_PATTERN = /^DEV-\d+$/

test('@fase-3 devolución parcial desde el expediente y total desde el resguardo', async ({
  page,
}) => {
  const api = await ApiClient.login()
  const custodyApi = await CustodyApi.withToken(api.token)

  const productName = UniqueName.for('Herramienta devolución')
  const employeeName = UniqueName.for('Empleado devolución')

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

  const [firstStock, secondStock] = stocks
  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto(`/personal/${employee.id}`)
  await expect(page.getByRole('heading', { name: employeeName })).toBeVisible()
  await page.getByRole('button', { name: `Devolver ${firstStock.consecutive}` }).click()

  await expect(page).toHaveURL(new RegExp(`/assignments/${custody.id}/return[?]stockIds=`))
  await expect(
    page.getByRole('heading', { name: `Devolución del resguardo ${custody.code}` }),
  ).toBeVisible()
  await expect(page.getByText('Seleccionadas 1 de 2 unidades pendientes.')).toBeVisible()
  await expect(page.getByText('Devolución parcial', { exact: true }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Registrar devolución' }).click()

  const partialHeading = page.getByRole('heading', { name: 'Devolución registrada' })
  await expect(partialHeading).toBeVisible()
  const partialSection = page.locator('section').filter({ has: partialHeading })
  const partialCode = (
    await partialSection.getByText(RETURN_CODE_PATTERN).first().innerText()
  ).trim()
  expect(partialCode).toMatch(RETURN_CODE_PATTERN)

  await page.getByRole('button', { name: 'Volver al resguardo' }).click()
  await expect(page).toHaveURL(new RegExp(`/assignments/${custody.id}$`))
  await expect(page.getByRole('heading', { name: `Resguardo ${custody.code}` })).toBeVisible()
  await expect(page.getByText('Parcialmente devuelto').first()).toBeVisible()

  await page.getByRole('button', { name: 'Registrar devolución' }).click()
  await expect(page).toHaveURL(new RegExp(`/assignments/${custody.id}/return$`))

  await page.locator('label', { has: page.getByLabel('Seleccionar todo') }).click()
  await expect(page.getByText('Seleccionadas 1 de 1 unidad pendiente.')).toBeVisible()
  await expect(page.getByText('Devolución total', { exact: true }).first()).toBeVisible()

  await page.getByLabel(`Condición de ${secondStock.consecutive}`).selectOption('DAÑADO')
  await page.getByRole('button', { name: 'Registrar devolución' }).click()
  await expect(page.getByText('Revisa los datos marcados.')).toBeVisible()

  await page
    .getByLabel(`Nota de ${secondStock.consecutive}`)
    .fill('Regresa con la carcasa rota tras una caída.')
  await page.getByRole('button', { name: 'Registrar devolución' }).click()

  const totalHeading = page.getByRole('heading', { name: 'Devolución registrada' })
  await expect(totalHeading).toBeVisible()
  const totalSection = page.locator('section').filter({ has: totalHeading })
  await expect(totalSection.getByText('Devolución total', { exact: true })).toBeVisible()
  await expect(totalSection.getByText(RETURN_CODE_PATTERN).first()).toBeVisible()

  await page.getByRole('button', { name: 'Ir al expediente' }).click()
  await expect(page).toHaveURL(new RegExp(`/personal/${employee.id}$`))
  await expect(page.getByRole('heading', { name: employeeName })).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})
