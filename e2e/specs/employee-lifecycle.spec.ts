import { expect, request, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { ConsoleWatcher } from '../support/console-watcher'
import { CustodyApi } from '../support/custody-api'
import { E2eConfig } from '../support/config'
import { UniqueName } from '../support/unique-name'

test('@fase-5 daños en el expediente y baja/reactivación de un empleado', async ({ page }) => {
  const api = await ApiClient.login()
  const custodyApi = await CustodyApi.withToken(api.token)

  const productName = UniqueName.for('Herramienta dañada')
  const employeeName = UniqueName.for('Empleado baja')

  const brand = await api.createBrand()
  const productModel = await api.createProductModel(brand.id)
  const product = await api.createProduct({
    brandId: brand.id,
    productModelId: productModel.id,
    name: productName,
  })
  const role = await api.firstRole()
  const employee = await api.createEmployee({ roleId: role.id, name: employeeName })
  const [stock] = await custodyApi.createStocks(product.id, 1)
  const custody = await custodyApi.createCustody(employee.id, [stock])

  const returnsContext = await request.newContext({
    extraHTTPHeaders: { Authorization: `Bearer ${api.token}`, Accept: 'application/json' },
  })
  const returnResponse = await returnsContext.post(
    `${E2eConfig.apiV1Url}/custodies/${custody.id}/returns`,
    {
      data: {
        items: [
          { stock_id: stock.id, condition: 'DAÑADO', notes: 'Se cayó y se rompió la carcasa.' },
        ],
      },
    },
  )
  if (!returnResponse.ok()) {
    throw new Error(
      `POST /custodies/{id}/returns respondió ${returnResponse.status()}: ${await returnResponse.text()}`,
    )
  }
  await returnsContext.dispose()

  await custodyApi.dispose()
  await api.dispose()

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto(`/personal/${employee.id}`)
  await expect(page.getByRole('heading', { name: employeeName })).toBeVisible()

  await page.getByRole('button', { name: /Daños/ }).click()
  await expect(page.getByText(productName).first()).toBeVisible()

  await page.getByRole('button', { name: 'Dar de baja' }).click()
  await expect(page.getByText(`¿Dar de baja a ${employeeName}?`)).toBeVisible()
  await page.getByRole('button', { name: 'Dar de baja' }).last().click()

  await expect(page.getByRole('button', { name: 'Reactivar' })).toBeVisible()

  await page.getByRole('button', { name: 'Reactivar' }).click()
  await expect(page.getByText(`¿Reactivar a ${employeeName}?`)).toBeVisible()
  await page.getByRole('button', { name: 'Reactivar' }).last().click()

  await expect(page.getByRole('button', { name: 'Dar de baja' })).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})
