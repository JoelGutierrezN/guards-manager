import { expect, test } from '@playwright/test'
import { ConsoleWatcher } from '../support/console-watcher'
import { E2eConfig } from '../support/config'

const NEW_PASSWORD = 'NewPassword123!'

test('@fase-6 editar perfil, cambiar contraseña y volver a entrar', async ({ page }) => {
  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/profile')
  await expect(page.getByRole('heading', { name: 'Mi perfil' })).toBeVisible()

  await page.getByLabel('Teléfono').fill('5500001234')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByText('Perfil actualizado.')).toBeVisible()

  await page.getByLabel('Contraseña actual').fill(E2eConfig.demoPassword)
  await page.getByLabel('Contraseña nueva').fill(NEW_PASSWORD)
  await page.getByLabel('Confirmar contraseña nueva').fill(NEW_PASSWORD)
  await page.getByRole('button', { name: 'Cambiar contraseña' }).click()
  await expect(page.getByText('Contraseña actualizada.')).toBeVisible()

  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/`)

  await page.getByLabel('Usuario').fill(E2eConfig.demoIdentifier)
  await page.getByLabel('Contraseña').fill(NEW_PASSWORD)
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/dashboard`)

  await page.goto('/profile')
  await page.getByLabel('Contraseña actual').fill(NEW_PASSWORD)
  await page.getByLabel('Contraseña nueva').fill(E2eConfig.demoPassword)
  await page.getByLabel('Confirmar contraseña nueva').fill(E2eConfig.demoPassword)
  await page.getByRole('button', { name: 'Cambiar contraseña' }).click()
  await expect(page.getByText('Contraseña actualizada.')).toBeVisible()

  expect(consoleWatcher.errors).toEqual([])
})
