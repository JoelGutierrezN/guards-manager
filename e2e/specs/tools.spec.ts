import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

test('@fase-1 crear, editar y eliminar una herramienta del catálogo', async ({ page }) => {
  const api = await ApiClient.login()
  const brand = await api.createBrand()
  const productModel = await api.createProductModel(brand.id)
  await api.dispose()

  const toolName = UniqueName.for('Herramienta')
  const editedToolName = `${toolName} editada`
  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/tools?new=1')

  const brandField = page.getByRole('combobox', { name: 'Marca' })
  await brandField.click()
  await brandField.fill(brand.name)
  await page.getByRole('option', { name: brand.name }).click()

  const productModelField = page.getByRole('combobox', { name: 'Modelo' })
  await productModelField.click()
  await productModelField.fill(productModel.name)
  await page.getByRole('option', { name: productModel.name }).click()

  await page.getByLabel('Nombre de la herramienta').fill(toolName)
  await page.getByRole('button', { name: 'Crear herramienta' }).click()

  const searchField = page.getByLabel('Buscar herramienta por nombre')
  await searchField.fill(toolName)

  const createdRow = page.getByRole('row').filter({ hasText: toolName })
  await expect(createdRow).toHaveCount(1)
  await expect(createdRow).toContainText(brand.name)
  await expect(createdRow).toContainText(productModel.name)

  await createdRow.getByRole('button', { name: `Editar ${toolName}` }).click()
  await page.getByLabel('Nombre de la herramienta').fill(editedToolName)
  await page.getByRole('button', { name: 'Guardar cambios' }).click()

  await searchField.fill(editedToolName)
  const editedRow = page.getByRole('row').filter({ hasText: editedToolName })
  await expect(editedRow).toHaveCount(1)

  await editedRow.getByRole('button', { name: `Eliminar ${editedToolName}` }).click()
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click()

  await expect(page.getByRole('row').filter({ hasText: editedToolName })).toHaveCount(0)
  await expect(page.getByText('Sin resultados')).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})
