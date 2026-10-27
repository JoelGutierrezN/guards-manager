import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { E2eConfig } from '../support/config'
import { UniqueName } from '../support/unique-name'

test('series: carrito mixto conserva serie y captura solo faltantes históricas', async ({
  page,
  request,
}) => {
  const api = await ApiClient.login()
  try {
    const headers = { Authorization: `Bearer ${api.token}`, Accept: 'application/json' }
    const brand = await api.createBrand()
    const productModel = await api.createProductModel(brand.id)
    const productName = UniqueName.for('Carrito mixto series')
    const product = await api.createProduct({
      brandId: brand.id,
      productModelId: productModel.id,
      name: productName,
    })
    const employee = await api.createEmployee({ roleId: (await api.firstRole()).id })
    const stockResponse = await request.post(
      `${E2eConfig.apiV1Url}/products/${product.id}/stocks`,
      { headers, data: { quantity: 2, condition: 'BUENO' } },
    )
    expect(stockResponse.status()).toBe(201)
    const stocks = (await stockResponse.json()).created as { id: string; consecutive: string }[]
    const registeredSerial = UniqueName.for('SERIE-REGISTRADA').toUpperCase()
    const registered = await request.post(
      `${E2eConfig.apiV1Url}/stocks/${stocks[0].id}/serial-corrections`,
      { headers, data: { serial: registeredSerial, expected_serial: null } },
    )
    expect(registered.status()).toBe(201)

    await page.goto(`/newAssignment?employeeId=${employee.id}`)
    await expect(page.getByText(employee.name, { exact: true }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Continuar' }).click()
    await page.getByRole('combobox', { name: 'Buscar herramienta' }).fill(productName)
    await page.getByRole('option', { name: productName }).click()
    await expect(page.locator('tbody tr')).toHaveCount(2)
    await page.locator('label', { has: page.getByLabel('Seleccionar todo') }).click()
    await page.getByRole('button', { name: 'Agregar 2 unidades' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    await expect(page.getByText(registeredSerial, { exact: true })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /Número de serie de/ })).toHaveCount(1)
    await page.getByRole('button', { name: 'Crear resguardo' }).click()
    await expect(page.getByText('Captura el número de serie de esta unidad.')).toBeVisible()
    const capturedSerial = UniqueName.for('SERIE-HISTORICA').toUpperCase()
    await page
      .getByRole('textbox', { name: /Número de serie de/ })
      .fill(`  ${capturedSerial.toLowerCase()}  `)
    const creationRequest = page.waitForRequest(
      (incoming) => incoming.method() === 'POST' && incoming.url().endsWith('/custodies'),
    )
    await page.getByRole('button', { name: 'Crear resguardo' }).click()
    const payload = (await creationRequest).postDataJSON()
    expect(
      payload.items.find((item: { stock_id: string }) => item.stock_id === stocks[0].id),
    ).not.toHaveProperty('serial')
    expect(
      payload.items.find((item: { stock_id: string }) => item.stock_id === stocks[1].id).serial,
    ).toBe(capturedSerial)
    await expect(page.getByRole('heading', { name: 'Resguardo creado' })).toBeVisible()
    await page.getByRole('button', { name: 'Ver resguardo' }).click()
    await expect(
      page.getByText(`Serie de entrega: ${registeredSerial}`, { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText(`Serie de entrega: ${capturedSerial}`, { exact: true }),
    ).toBeVisible()
  } finally {
    await api.dispose()
  }
})

test('series: corrección asignada maneja concurrencia, duplicados y reimprime tras devolución', async ({
  page,
  request,
}) => {
  test.setTimeout(120_000)
  const api = await ApiClient.login()
  try {
    const headers = { Authorization: `Bearer ${api.token}`, Accept: 'application/json' }
    const brand = await api.createBrand()
    const productModel = await api.createProductModel(brand.id)
    const productName = UniqueName.for('Correccion asignada')
    const product = await api.createProduct({
      brandId: brand.id,
      productModelId: productModel.id,
      name: productName,
    })
    const employee = await api.createEmployee({ roleId: (await api.firstRole()).id })
    const stockResponse = await request.post(
      `${E2eConfig.apiV1Url}/products/${product.id}/stocks`,
      { headers, data: { quantity: 2, condition: 'BUENO' } },
    )
    expect(stockResponse.status()).toBe(201)
    const stocks = (await stockResponse.json()).created as { id: string; consecutive: string }[]
    const originalSerial = UniqueName.for('ORIGINAL').toUpperCase()
    const occupiedSerial = UniqueName.for('OCUPADA').toUpperCase()
    const custodyResponse = await request.post(`${E2eConfig.apiV1Url}/custodies`, {
      headers,
      data: {
        employee_id: employee.id,
        items: stocks.map((stock, index) => ({
          stock_id: stock.id,
          condition: 'BUENO',
          serial: index === 0 ? originalSerial : occupiedSerial,
        })),
      },
    })
    expect(custodyResponse.status()).toBe(201)
    const custody = await custodyResponse.json()

    await page.goto(`/tools?name=${encodeURIComponent(productName)}`)
    await page
      .locator('tr', { hasText: productName })
      .locator('button[title^="Ver existencias en detalle"]')
      .click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Asignadas/ })
      .click()
    await page
      .getByRole('button', { name: `Corregir serie de ${stocks[0].consecutive}`, exact: true })
      .click()
    await expect(page.getByRole('heading', { name: 'Corregir serie', exact: true })).toBeVisible()
    await expect(page.getByText(/Se generará un acuse independiente/)).toBeVisible()
    const concurrentSerial = UniqueName.for('CONCURRENTE').toUpperCase()
    const concurrent = await request.post(
      `${E2eConfig.apiV1Url}/stocks/${stocks[0].id}/serial-corrections`,
      { headers, data: { serial: concurrentSerial, expected_serial: originalSerial } },
    )
    expect(concurrent.status()).toBe(201)
    const finalSerial = UniqueName.for('CORREGIDA').toUpperCase()
    await page.getByRole('textbox', { name: 'Nueva serie', exact: true }).fill(finalSerial)
    await page.getByRole('button', { name: 'Revisar corrección' }).click()
    await page.getByRole('button', { name: 'Confirmar corrección' }).click()
    await expect(
      page.getByRole('alert').filter({ hasText: /Revisa la serie actual/ }),
    ).toBeVisible()
    await expect(page.getByText(concurrentSerial, { exact: true })).toBeVisible()

    await page.getByRole('textbox', { name: 'Nueva serie', exact: true }).fill(occupiedSerial)
    await page.getByRole('button', { name: 'Revisar corrección' }).click()
    await page.getByRole('button', { name: 'Confirmar corrección' }).click()
    await expect(page.getByRole('textbox', { name: 'Nueva serie', exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await page.getByRole('textbox', { name: 'Nueva serie', exact: true }).fill(finalSerial)
    await page.getByLabel('Motivo de la corrección').fill('Lectura verificada de la placa')
    await page.getByRole('button', { name: 'Revisar corrección' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Confirmar corrección' }).click()
    expect((await downloadPromise).suggestedFilename()).toMatch(/\.pdf$/)
    await page.screenshot({ path: test.info().outputPath('serial-correction-desktop.png') })
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.getByRole('dialog').last()).toBeVisible()
    const correctionDialog = page.getByRole('dialog').last()
    const modalBounds = await correctionDialog.boundingBox()
    expect(modalBounds!.x).toBeGreaterThanOrEqual(0)
    expect(modalBounds!.x + modalBounds!.width).toBeLessThanOrEqual(390)
    expect(
      await correctionDialog.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true)
    await page.screenshot({ path: test.info().outputPath('serial-correction-mobile.png') })
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(
      page.getByText('Acuse descargado. Imprímelo y entrégalo al responsable.'),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Cerrar corrección de serie' }).click()

    const snapshotResponse = await request.get(`${E2eConfig.apiV1Url}/custodies/${custody.id}`, {
      headers,
    })
    const snapshot = await snapshotResponse.json()
    expect(
      snapshot.items.find((item: { stockId: string }) => item.stockId === stocks[0].id)
        .serialAtAssignment,
    ).toBe(originalSerial)
    expect(snapshot.sheet).toEqual(custody.sheet)
    const returned = await request.post(`${E2eConfig.apiV1Url}/custodies/${custody.id}/returns`, {
      headers,
      data: { items: [{ stock_id: stocks[0].id, condition: 'BUENO' }] },
    })
    expect(returned.status()).toBe(201)

    await page.reload()
    await page
      .locator('tr', { hasText: productName })
      .locator('button[title^="Ver existencias en detalle"]')
      .click()
    await page
      .getByRole('button', { name: `Corregir serie de ${stocks[0].consecutive}`, exact: true })
      .click()
    await expect(page.getByRole('heading', { name: 'Historial de series' })).toBeVisible()
    await expect(
      page.getByRole('dialog').last().getByText(finalSerial, { exact: true }),
    ).toBeVisible()
    const reprintPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Reimprimir acuse' }).first().click()
    expect((await reprintPromise).suggestedFilename()).toMatch(/\.pdf$/)
  } finally {
    await api.dispose()
  }
})
