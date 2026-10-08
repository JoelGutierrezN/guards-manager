import { expect, test } from '@playwright/test'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

test('@fase-7 importar la plantilla con 2 filas válidas y 1 inválida', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)

  const brandName = UniqueName.for('MarcaImport')
  const modelName = UniqueName.for('ModeloImport')
  const firstProductName = UniqueName.for('ProductoImport')
  const secondProductName = UniqueName.for('ProductoImport')
  const invalidProductName = UniqueName.for('ProductoInvalido')

  // La tercera fila va sin marca: el API la apila en `errors` como objeto `{ row, message }`.
  const csvContent = [
    'nombre,marca,modelo',
    `${firstProductName},${brandName},${modelName}`,
    `${secondProductName},${brandName},${modelName}`,
    `${invalidProductName},,${modelName}`,
  ].join('\n')

  await page.goto('/tools')
  await page.getByRole('button', { name: 'Importar' }).click()

  await expect(page.getByText('Importar productos')).toBeVisible()

  await page.locator('input[type="file"]').setInputFiles({
    name: 'productos.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(csvContent, 'utf-8'),
  })

  await page.getByRole('button', { name: 'Importar archivo' }).click()

  await expect(page.getByText('Completado')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('Productos creados')).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: /^Fila \d+: / })).toHaveCount(1)

  expect(consoleWatcher.errors).toEqual([])
})
