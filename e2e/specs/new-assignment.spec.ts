import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

const CUSTODY_CODE_PATTERN = /^AS-\d+$/

test('@fase-2 crear un resguardo con 2 unidades y verlo en el listado y en el expediente', async ({
  page,
}) => {
  const api = await ApiClient.login()
  const productName = UniqueName.for('Herramienta resguardo')
  const employeeName = UniqueName.for('Empleado resguardo')

  const brand = await api.createBrand()
  const productModel = await api.createProductModel(brand.id)
  const product = await api.createProduct({
    brandId: brand.id,
    productModelId: productModel.id,
    name: productName,
  })
  const role = await api.firstRole()
  const employee = await api.createEmployee({ roleId: role.id, name: employeeName })
  await api.dispose()

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto(`/stockIn?productId=${product.id}`)
  await page.getByLabel('Cantidad de unidades').fill('2')
  await page.getByRole('button', { name: 'Registrar ingreso' }).click()
  await expect(page.getByRole('heading', { name: /Ingreso registrado/ })).toBeVisible()

  await page.goto(`/newAssignment?employeeId=${employee.id}`)
  await expect(page.getByRole('heading', { name: 'Nueva asignación' })).toBeVisible()
  await expect(page.getByText(employeeName, { exact: true }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Continuar' }).click()

  const productField = page.getByRole('combobox', { name: 'Buscar herramienta' })
  await productField.click()
  await productField.fill(productName)
  await page.getByRole('option', { name: productName }).click()

  const unitRows = page.locator('tbody tr')
  await expect(unitRows).toHaveCount(2)
  await expect(page.locator('tbody tr', { hasText: productName })).toHaveCount(2)

  const selectAllLabel = page.locator('label', { has: page.getByLabel('Seleccionar todo') })
  await selectAllLabel.click()
  await page.getByRole('button', { name: 'Agregar 2 unidades' }).click()
  await expect(page.getByText('2 unidades en el carrito')).toBeVisible()

  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Crear resguardo' }).click()

  const successHeading = page.getByRole('heading', { name: 'Resguardo creado' })
  await expect(successHeading).toBeVisible()

  const successSection = page.locator('section').filter({ has: successHeading })
  const custodyCode = (
    await successSection.getByText(CUSTODY_CODE_PATTERN).first().innerText()
  ).trim()

  await page.getByRole('button', { name: 'Ver resguardo' }).click()
  await expect(page).toHaveURL(/\/assignments\/[^/]+$/)
  await expect(page.getByRole('heading', { name: `Resguardo ${custodyCode}` })).toBeVisible()
  await expect(page.getByText(productName).first()).toBeVisible()

  await page.goto('/assignments')
  await page.getByLabel('Buscar resguardos').fill(custodyCode)
  const custodyRow = page.locator('tbody tr', { hasText: custodyCode })
  await expect(custodyRow).toHaveCount(1)
  await expect(custodyRow).toContainText(employeeName)

  await page.goto(`/personal/${employee.id}`)
  await expect(page.getByRole('heading', { name: employeeName })).toBeVisible()
  const fileRow = page.locator('tbody tr', { hasText: custodyCode })
  await expect(fileRow.first()).toBeVisible()
  await expect(fileRow.first()).toContainText(productName)

  expect(consoleWatcher.errors).toEqual([])
})
