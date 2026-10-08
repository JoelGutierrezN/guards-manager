import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { ConsoleWatcher } from '../support/console-watcher'
import { E2eConfig } from '../support/config'

const INITIAL_PASSWORD = 'Password123!'
const NEW_PASSWORD = 'NewPassword123!'

/**
 * El spec cierra sesión y cambia la contraseña, y `POST /me/password` revoca los demás tokens del
 * usuario. Con el `storageState` compartido de `auth.setup` (testuser) el resto de la suite se
 * quedaría fuera, así que este spec crea su propio usuario y entra por la pantalla de login.
 */
test.use({ storageState: { cookies: [], origins: [] } })

test('@fase-6 editar perfil, cambiar contraseña y volver a entrar', async ({ page }) => {
  const api = await ApiClient.login()
  const account = await api.createUser({ password: INITIAL_PASSWORD })
  await api.dispose()

  const consoleWatcher = ConsoleWatcher.attach(page)

  await page.goto('/profile')
  await page.getByLabel('Usuario').fill(account.username)
  await page.getByLabel('Contraseña').fill(INITIAL_PASSWORD)
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click()

  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/profile`)
  await expect(page.getByRole('heading', { name: 'Mi perfil' })).toBeVisible()

  await page.getByLabel('Teléfono').fill('5500001234')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByText('Perfil actualizado.')).toBeVisible()

  await page.getByLabel('Contraseña actual').fill(INITIAL_PASSWORD)
  await page.getByLabel('Contraseña nueva', { exact: true }).fill(NEW_PASSWORD)
  await page.getByLabel('Confirmar contraseña nueva').fill(NEW_PASSWORD)
  await page.getByRole('button', { name: 'Cambiar contraseña' }).click()
  await expect(page.getByText('Contraseña actualizada.')).toBeVisible()

  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/`)

  await page.getByLabel('Usuario').fill(account.username)
  await page.getByLabel('Contraseña').fill(NEW_PASSWORD)
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click()

  // Al cerrar sesión desde /profile el middleware guarda el origen, así que el login vuelve ahí.
  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/profile`)
  await expect(page.getByRole('heading', { name: 'Mi perfil' })).toBeVisible()
  await expect(page.getByLabel('Teléfono')).toHaveValue('5500001234')

  expect(consoleWatcher.errors).toEqual([])
})
