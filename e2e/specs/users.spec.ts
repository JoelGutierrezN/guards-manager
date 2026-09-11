import { expect, test } from '@playwright/test'
import { ConsoleWatcher } from '../support/console-watcher'
import { UniqueName } from '../support/unique-name'

test('@fase-6 crear, editar y eliminar un usuario del sistema', async ({ page }) => {
  const userName = UniqueName.for('Usuario')
  const editedUserName = `${userName} editado`
  const username = UniqueName.for('usuario').toLowerCase().replace(/\s+/g, '-')
  const email = UniqueName.email('usuario')

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/users')
  await expect(page.getByRole('heading', { name: 'Usuarios del sistema' })).toBeVisible()

  await page.getByRole('button', { name: 'Nuevo usuario' }).click()

  await page.getByLabel('Nombre completo').fill(userName)
  await page.getByLabel('Usuario', { exact: true }).fill(username)
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill('clave-segura-123')
  await page.getByRole('button', { name: 'Crear usuario' }).click()

  const searchField = page.getByLabel('Buscar usuarios')
  await searchField.fill(userName)

  const createdRow = page.getByRole('row').filter({ hasText: userName })
  await expect(createdRow).toHaveCount(1)

  await createdRow.getByRole('button', { name: `Editar ${userName}` }).click()
  await page.getByLabel('Nombre completo').fill(editedUserName)
  await page.getByRole('button', { name: 'Guardar cambios' }).click()

  await searchField.fill(editedUserName)
  const editedRow = page.getByRole('row').filter({ hasText: editedUserName })
  await expect(editedRow).toHaveCount(1)

  await editedRow.getByRole('button', { name: `Eliminar ${editedUserName}` }).click()
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click()

  await expect(page.getByText('Sin resultados')).toBeVisible()
  await expect(page.getByRole('button', { name: `Eliminar ${editedUserName}` })).toHaveCount(0)

  expect(consoleWatcher.errors).toEqual([])
})
